import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const devices = ['BAT001', 'BAT002', 'BAT003'];

async function seed() {
  console.log('Seeding battery data...');

  for (const deviceId of devices) {
    // Insert into bms_identification
    await pool.query(
      `INSERT INTO bms_identification (device_id, device_type, battery_number, firmware_version, hardware_version)
       VALUES ($1, 'BMS', $1, '1.0.0', '1.0.0') ON CONFLICT DO NOTHING`,
      [deviceId]
    );
    console.log(`Identified device: ${deviceId}`);

    // Insert GPS data
    await pool.query(
      `INSERT INTO iot_gps (device_id, gps_lat_coordinate, gps_long_coordinate, gps_speed)
       VALUES ($1, ${40 + Math.random() * 10}, ${-70 - Math.random() * 10}, ${Math.random() * 100})`,
      [deviceId]
    );
    console.log(`GPS data for device: ${deviceId}`);

    // Insert historical bms_values
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      await pool.query(
        `INSERT INTO bms_values (device_id, timestamp, pack_voltage, pack_current, soc, soh, cycle_count, cell_temps)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          deviceId,
          timestamp,
          12.0 + Math.random() * 0.8, // voltage
          5 + Math.random() * 5, // current
          80 - i * 2 + Math.random() * 5, // soc
          95 - i * 0.1, // soh
          50 + i, // cycle_count
          `{${20 + Math.random() * 5}, ${20 + Math.random() * 5}, ${20 + Math.random() * 5}}` // cell_temps
        ]
      );
    }
    console.log(`Seeded 24h of bms_values for ${deviceId}`);
  }

  // Seed alarms and faults
  await pool.query(`
    INSERT INTO bms_alarm_enum (name, value) VALUES ('OverPackVoltageAlarm', 1), ('UnderPackVoltageAlarm', 2) ON CONFLICT DO NOTHING;
    INSERT INTO bms_fault_enum (name, value) VALUES ('OverPackVoltageFault', 1), ('UnderPackVoltageFault', 2) ON CONFLICT DO NOTHING;
  `);
  await pool.query(`INSERT INTO bms_alarm (device_id, bms_alarm) VALUES ('BAT002', 1)`);
  await pool.query(`INSERT INTO bms_fault (device_id, bms_fault) VALUES ('BAT003', 2)`);
  console.log('Seeded some alarms and faults.');

  await pool.end();
  console.log('Finished seeding data.');
}

seed().catch(err => {
  console.error('Error seeding data:', err);
  pool.end();
});
