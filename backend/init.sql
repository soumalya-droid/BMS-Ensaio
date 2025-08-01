-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- BMS Identification Packet (evc_470)
CREATE TABLE IF NOT EXISTS bms_identification (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(32),
    timestamp TIMESTAMPTZ,
    event_code VARCHAR(8),
    device_type VARCHAR(32),
    battery_number VARCHAR(32),
    firmware_version VARCHAR(32),
    hardware_version VARCHAR(32),
    bms_config_version VARCHAR(32),
    user_id INTEGER REFERENCES users(id)
);
