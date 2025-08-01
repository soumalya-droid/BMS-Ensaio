CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS user_batteries (
  user_id INTEGER REFERENCES users(id),
  device_id VARCHAR(32),
  PRIMARY KEY (user_id, device_id)
);

-- Seed user roles
UPDATE users SET role = 'admin' WHERE email = 'admin@bms.com';
UPDATE users SET role = 'user' WHERE email = 'user@bms.com';

-- Seed battery assignments
-- Make sure these users and devices exist
INSERT INTO user_batteries (user_id, device_id)
SELECT id, 'ABT860181064031393' FROM users WHERE email = 'admin@bms.com'
ON CONFLICT (user_id, device_id) DO NOTHING;

INSERT INTO user_batteries (user_id, device_id)
SELECT id, 'ABT860181064031393' FROM users WHERE email = 'user@bms.com'
ON CONFLICT (user_id, device_id) DO NOTHING;

INSERT INTO user_batteries (user_id, device_id)
SELECT id, 'ABT860181064031394' FROM users WHERE email = 'admin@bms.com'
ON CONFLICT (user_id, device_id) DO NOTHING;
