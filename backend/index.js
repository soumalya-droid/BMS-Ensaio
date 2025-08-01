import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(cors());
app.use(express.json());

// User registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hash]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    try {
      const dbUser = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [user.id]);
      if (dbUser.rows.length === 0) return res.sendStatus(403);
      req.user = dbUser.rows[0];
      next();
    } catch (dbError) {
      res.sendStatus(500);
    }
  });
};

// Get all batteries for a specific user or all batteries for an admin
app.get('/api/batteries', authenticateToken, async (req, res) => {
  const { id: userId, role } = req.user;

  try {
    let query;
    let queryParams = [];

    if (role === 'admin') {
      query = `
        SELECT DISTINCT ON (bms.device_id)
          bms.device_id as id, bms.pack_voltage, bms.soc, bms.soh, bms.cycle_count,
          bms.cell_temps, bms.timestamp as last_update,
          gps.gps_lat_coordinate as latitude, gps.gps_long_coordinate as longitude
        FROM bms_values bms
        LEFT JOIN (
          SELECT DISTINCT ON (device_id) device_id, gps_lat_coordinate, gps_long_coordinate
          FROM iot_gps ORDER BY device_id, timestamp DESC
        ) gps ON bms.device_id = gps.device_id
        ORDER BY bms.device_id, bms.timestamp DESC
      `;
    } else {
      query = `
        SELECT DISTINCT ON (bms.device_id)
          bms.device_id as id, bms.pack_voltage, bms.soc, bms.soh, bms.cycle_count,
          bms.cell_temps, bms.timestamp as last_update,
          gps.gps_lat_coordinate as latitude, gps.gps_long_coordinate as longitude
        FROM bms_values bms
        INNER JOIN bms_identification bi ON bms.device_id = bi.device_id
        LEFT JOIN (
          SELECT DISTINCT ON (device_id) device_id, gps_lat_coordinate, gps_long_coordinate
          FROM iot_gps ORDER BY device_id, timestamp DESC
        ) gps ON bms.device_id = gps.device_id
        WHERE bi.user_id = $1
        ORDER BY bms.device_id, bms.timestamp DESC
      `;
      queryParams.push(userId);
    }

    const result = await pool.query(query, queryParams);

    const batteries = result.rows.map(b => ({
      id: b.id,
      voltage: b.pack_voltage,
      stateOfCharge: b.soc,
      health: b.soh,
      cycleCount: b.cycle_count,
      temperature: b.cell_temps && b.cell_temps.length > 0
        ? Math.round(b.cell_temps.reduce((a, c) => a + c, 0) / b.cell_temps.length)
        : 0,
      status: b.pack_voltage > 10 ? 'online' : 'offline', // Simplified status
      latitude: b.latitude,
      longitude: b.longitude,
      lastUpdate: b.last_update
    }));

    res.json(batteries);
  } catch (err) {
    console.error("Error fetching batteries:", err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Get historical data for a specific battery
app.get('/api/batteries/:id/historical', async (req, res) => {
  const { id } = req.params;
  const { metric } = req.query;

  const allowedMetrics = {
    voltage: 'pack_voltage',
    temperature: 'cell_temps',
    stateOfCharge: 'soc',
    health: 'soh',
  };

  if (!allowedMetrics[metric]) {
    return res.status(400).json({ error: 'Invalid metric' });
  }

  try {
    const result = await pool.query(
      `SELECT timestamp, ${allowedMetrics[metric]} as value
       FROM bms_values
       WHERE device_id = $1 AND timestamp >= NOW() - INTERVAL '24 hours'
       ORDER BY timestamp ASC`,
      [id]
    );

    let chartData;

    if (metric === 'temperature') {
      chartData = result.rows.map(row => {
        const time = new Date(row.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const record = { time };
        if (Array.isArray(row.value)) {
          row.value.forEach((temp, i) => {
            record[`temp${i + 1}`] = temp;
          });
        }
        return record;
      });
    } else {
      chartData = result.rows.map(row => ({
        time: new Date(row.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        [metric]: row.value,
      }));
    }

    res.json(chartData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single battery's details
app.get('/api/batteries/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT
        bms.device_id as id,
        bms.pack_voltage,
        bms.pack_current,
        bms.soc,
        bms.soh,
        bms.cycle_count,
        bms.cell_temps,
        bms.timestamp as last_update,
        gps.gps_lat_coordinate as latitude,
        gps.gps_long_coordinate as longitude
      FROM bms_values bms
      LEFT JOIN (
        SELECT DISTINCT ON (device_id)
          device_id,
          gps_lat_coordinate,
          gps_long_coordinate
        FROM iot_gps
        ORDER BY device_id, timestamp DESC
      ) gps ON bms.device_id = gps.device_id
      WHERE bms.device_id = $1
      ORDER BY bms.timestamp DESC
      LIMIT 1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Battery not found' });
    }

    const b = result.rows[0];
    const batteryDetails = {
      id: b.id,
      voltage: b.pack_voltage,
      current: b.pack_current,
      stateOfCharge: b.soc,
      health: b.soh,
      cycleCount: b.cycle_count,
      temperature: b.cell_temps && b.cell_temps.length > 0
        ? Math.round(b.cell_temps.reduce((a, c) => a + c, 0) / b.cell_temps.length)
        : 0,
      status: b.pack_voltage > 10 ? 'online' : 'offline', // Simplified status
      latitude: b.latitude,
      longitude: b.longitude,
      lastUpdate: b.last_update
    };

    res.json(batteryDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get logs for a specific battery
app.get('/api/batteries/:id/logs', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      (SELECT
        a.id,
        a.timestamp,
        'alarm' as "eventType",
        COALESCE(ae.name, 'Unknown alarm code') as description,
        a.bms_alarm as value
      FROM bms_alarm a
      LEFT JOIN bms_alarm_enum ae ON a.bms_alarm = ae.value
      WHERE a.device_id = $1)
      UNION ALL
      (SELECT
        f.id,
        f.timestamp,
        'fault' as "eventType",
        COALESCE(fe.name, 'Unknown fault code') as description,
        f.bms_fault as value
      FROM bms_fault f
      LEFT JOIN bms_fault_enum fe ON f.bms_fault = fe.value
      WHERE f.device_id = $1)
      ORDER BY timestamp DESC
      LIMIT 100
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export data for a specific battery as CSV
app.get('/api/batteries/:id/export', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM bms_values WHERE device_id = $1 ORDER BY timestamp DESC', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data to export for this battery' });
    }

    const json2csv = (json) => {
      const fields = Object.keys(json[0]);
      const csv = [
        fields.join(','),
        ...json.map(row => fields.map(field => JSON.stringify(row[field])).join(','))
      ].join('\n');
      return csv;
    };

    const csvData = json2csv(result.rows);

    res.header('Content-Type', 'text/csv');
    res.attachment(`battery_${id}_export.csv`);
    res.send(csvData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get route data for a specific battery
app.get('/api/batteries/:id/route', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT gps_lat_coordinate as lat, gps_long_coordinate as lng FROM iot_gps WHERE device_id = $1 ORDER BY timestamp ASC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.device_id, a.timestamp, 'alarm' as type, a.bms_alarm as code, a.read, COALESCE(ae.name, 'Unknown alarm code') as description
      FROM bms_alarm a
      LEFT JOIN bms_alarm_enum ae ON a.bms_alarm = ae.value
      UNION ALL
      SELECT f.id, f.device_id, f.timestamp, 'fault' as type, f.bms_fault as code, f.read, COALESCE(fe.name, 'Unknown fault code') as description
      FROM bms_fault f
      LEFT JOIN bms_fault_enum fe ON f.bms_fault = fe.value
      ORDER BY timestamp DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark a notification as read
app.post('/api/notifications/:type/:id/read', async (req, res) => {
  const { type, id } = req.params;
  const table = type === 'alarm' ? 'bms_alarm' : 'bms_fault';

  try {
    await pool.query(`UPDATE ${table} SET read = TRUE WHERE id = $1`, [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(4000, () => console.log('Backend running on port 4000'));
