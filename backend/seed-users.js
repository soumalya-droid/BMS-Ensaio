import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const users = [
  { name: 'Admin User', email: 'admin@bms.com', password: 'admin123', role: 'admin' },
  { name: 'User', email: 'user@bms.com', password: 'user123', role: 'user' },
  { name: 'Demo User', email: 'demo@bms.com', password: 'demo123', role: 'user' }
];

const devices = [
    { device_id: 'ABT860987058128056', user_email: 'admin@bms.com' },
    { device_id: 'ABT860987058128057', user_email: 'admin@bms.com' },
    { device_id: 'ABT860987058128058', user_email: 'user@bms.com' },
];

async function seed() {
  // Seed users
  const userIds = {};
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    try {
      const res = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = $1, role = $4 RETURNING id',
        [user.name, user.email, hash, user.role]
      );
      userIds[user.email] = res.rows[0].id;
      console.log(`Seeded user: ${user.email}`);
    } catch (e) {
      console.error(`Error seeding user ${user.email}:`, e.message);
    }
  }

  // Seed devices
  for (const device of devices) {
    try {
      const userId = userIds[device.user_email];
      if (userId) {
        // Add to bms_identification
        await pool.query(
          'INSERT INTO bms_identification (device_id, user_id) VALUES ($1, $2) ON CONFLICT (device_id) DO UPDATE SET user_id = $2',
          [device.device_id, userId]
        );
        console.log(`Assigned device ${device.device_id} to user ${device.user_email}`);

        // Add dummy data to bms_values
        await pool.query(
          'INSERT INTO bms_values (device_id, pack_voltage) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [device.device_id, 50]
        );
      }
    } catch (e) {
      console.error(`Error seeding device ${device.device_id}:`, e.message);
    }
  }

  await pool.end();
}

seed();
