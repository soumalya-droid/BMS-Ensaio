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
    bms_config_version VARCHAR(32)
);

-- BMS Values Packet (evc_471)
CREATE TABLE IF NOT EXISTS bms_values (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(32),
    timestamp TIMESTAMPTZ,
    event_code VARCHAR(8),
    device_type VARCHAR(32),
    bms_id VARCHAR(32),
    epochtime BIGINT,
    pack_voltage INTEGER,
    pack_current INTEGER,
    max_pack_current INTEGER,
    avg_pack_current INTEGER,
    regen_current INTEGER,
    pack_power INTEGER,
    soc INTEGER,
    sop INTEGER,
    soh INTEGER,
    remaining_capacity INTEGER,
    energy_out INTEGER,
    energy_in INTEGER,
    cycle_count INTEGER,
    bms_data_event VARCHAR(32),
    bms_power_mode VARCHAR(32),
    pack_current_state VARCHAR(32),
    ignition_over_can_flag INTEGER,
    charge_fet INTEGER,
    discharge_fet INTEGER,
    ignition_state INTEGER,
    pdu_power_rail INTEGER,
    status_pin INTEGER,
    last_fault INTEGER,
    last_alarm INTEGER,
    cell_temps INTEGER[]
);

-- BMS Alarm Packet (evc_473)
CREATE TABLE IF NOT EXISTS bms_alarm (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(32),
    timestamp TIMESTAMPTZ,
    event_code VARCHAR(8),
    device_type VARCHAR(32),
    bms_id VARCHAR(32),
    bms_alarm INTEGER,
    read BOOLEAN DEFAULT FALSE
);

-- BMS Fault Packet (evc_474)
CREATE TABLE IF NOT EXISTS bms_fault (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(32),
    timestamp TIMESTAMPTZ,
    event_code VARCHAR(8),
    device_type VARCHAR(32),
    bms_id VARCHAR(32),
    epochtime BIGINT,
    bms_fault INTEGER,
    read BOOLEAN DEFAULT FALSE
);

-- IoT Bootup Packet (evc_476)
CREATE TABLE IF NOT EXISTS iot_bootup (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(32),
    timestamp TIMESTAMPTZ,
    event_code VARCHAR(8),
    device_type VARCHAR(32),
    epochtime BIGINT,
    firmware_version VARCHAR(32),
    hardware_version VARCHAR(32),
    bootup_reason INTEGER
);

-- IoT GPS Packet (evc_477)
CREATE TABLE IF NOT EXISTS iot_gps (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(32),
    timestamp TIMESTAMPTZ,
    event_code VARCHAR(8),
    device_type VARCHAR(32),
    gps_fix_status INTEGER,
    gps_no_of_satellites INTEGER,
    gps_lat_dir INTEGER,
    gps_long_dir INTEGER,
    gps_lat_coordinate FLOAT,
    gps_long_coordinate FLOAT,
    gps_speed FLOAT
);

-- ENUM tables for faults, alarms, bootup reasons
CREATE TABLE IF NOT EXISTS bms_fault_enum (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64),
    value INTEGER
);
CREATE TABLE IF NOT EXISTS bms_alarm_enum (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64),
    value INTEGER
);
CREATE TABLE IF NOT EXISTS bootup_reason_enum (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64),
    value INTEGER
);
