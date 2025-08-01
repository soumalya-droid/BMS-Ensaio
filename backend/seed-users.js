import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const users = [
  { name: 'Admin User', email: 'admin@bms.com', password: 'admin123' },
  { name: 'User', email: 'user@bms.com', password: 'user123' },
  { name: 'Demo User', email: 'demo@bms.com', password: 'demo123' }
];

const batteries = [
  { device_id: 'ABT860987058128056', user_email: 'admin@bms.com' },
  { device_id: 'ABT860987058128057', user_email: 'admin@bms.com' },
  { device_id: 'ABT860987058128058', user_email: 'user@bms.com' },
];

async function seed() {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    try {
      const res = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name = $1 RETURNING id',
        [user.name, user.email, hash]
      );
      console.log(`Seeded user: ${user.email}`);
      const userId = res.rows[0].id;
      for (const battery of batteries) {
        if (battery.user_email === user.email) {
          await pool.query(
            'INSERT INTO user_batteries (user_id, device_id) VALUES ($1, $2) ON CONFLICT (user_id, device_id) DO NOTHING',
            [userId, battery.device_id]
          );
          console.log(`Assigned battery ${battery.device_id} to user ${user.email}`);
        }
      }
    } catch (e) {
      console.error(`Error seeding user ${user.email}:`, e.message);
    }
  }
  await pool.end();
}

seed();
