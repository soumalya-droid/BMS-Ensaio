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

async function seed() {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    try {
      await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
        [user.name, user.email, hash]
      );
      console.log(`Seeded user: ${user.email}`);
    } catch (e) {
      console.error(`Error seeding user ${user.email}:`, e.message);
    }
  }
  await pool.end();
}

seed();
