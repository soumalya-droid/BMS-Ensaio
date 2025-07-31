// Mock data for the BMS application
export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@bms.com',
    role: 'admin',
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'user@bms.com',
    role: 'user',
    createdAt: '2024-02-01',
    status: 'active'
  },
  {
    id: 3,
    name: 'Demo User',
    email: 'demo@bms.com',
    role: 'user',
    createdAt: '2024-02-15',
    status: 'active'
  }
];

export const mockBatteries = [
  {
    id: 'BAT001',
    userId: 2,
    voltage: 12.4,
    temperature: 25,
    health: 95,
    status: 'online',
    latitude: 40.7128,
    longitude: -74.0060,
    location: 'New York, NY',
    cycleCount: 245,
    stateOfCharge: 87,
    lastUpdate: '2024-07-22T10:30:00Z'
  },
  {
    id: 'BAT002',
    userId: 2,
    voltage: 11.8,
    temperature: 32,
    health: 78,
    status: 'warning',
    latitude: 34.0522,
    longitude: -118.2437,
    location: 'Los Angeles, CA',
    cycleCount: 892,
    stateOfCharge: 65,
    lastUpdate: '2024-07-22T10:25:00Z'
  },
  {
    id: 'BAT003',
    userId: 3,
    voltage: 10.2,
    temperature: 45,
    health: 45,
    status: 'offline',
    latitude: 41.8781,
    longitude: -87.6298,
    location: 'Chicago, IL',
    cycleCount: 1456,
    stateOfCharge: 12,
    lastUpdate: '2024-07-22T09:15:00Z'
  },
  {
    id: 'BAT004',
    userId: 2,
    voltage: 12.6,
    temperature: 22,
    health: 98,
    status: 'online',
    latitude: 37.7749,
    longitude: -122.4194,
    location: 'San Francisco, CA',
    cycleCount: 156,
    stateOfCharge: 94,
    lastUpdate: '2024-07-22T10:32:00Z'
  },
  {
    id: 'BAT005',
    userId: 3,
    voltage: 12.1,
    temperature: 28,
    health: 82,
    status: 'online',
    latitude: 39.9526,
    longitude: -75.1652,
    location: 'Philadelphia, PA',
    cycleCount: 678,
    stateOfCharge: 76,
    lastUpdate: '2024-07-22T10:28:00Z'
  }
];

export const mockLogs = [
  {
    id: 1,
    batteryId: 'BAT001',
    timestamp: '2024-07-22T10:30:00Z',
    eventType: 'voltage_reading',
    value: 12.4,
    description: 'Normal voltage reading'
  },
  {
    id: 2,
    batteryId: 'BAT001',
    timestamp: '2024-07-22T10:25:00Z',
    eventType: 'temperature_reading',
    value: 25,
    description: 'Temperature within normal range'
  },
  {
    id: 3,
    batteryId: 'BAT002',
    timestamp: '2024-07-22T10:25:00Z',
    eventType: 'temperature_alert',
    value: 32,
    description: 'Temperature approaching warning threshold'
  },
  {
    id: 4,
    batteryId: 'BAT003',
    timestamp: '2024-07-22T09:15:00Z',
    eventType: 'connection_lost',
    value: null,
    description: 'Battery went offline'
  },
  {
    id: 5,
    batteryId: 'BAT004',
    timestamp: '2024-07-22T10:32:00Z',
    eventType: 'health_check',
    value: 98,
    description: 'Excellent battery health'
  }
];

export const mockAlerts = [
  {
    id: 1,
    batteryId: 'BAT002',
    type: 'temperature',
    severity: 'warning',
    message: 'Battery temperature approaching critical threshold',
    timestamp: '2024-07-22T10:25:00Z',
    acknowledged: false
  },
  {
    id: 2,
    batteryId: 'BAT003',
    type: 'connection',
    severity: 'critical',
    message: 'Battery connection lost',
    timestamp: '2024-07-22T09:15:00Z',
    acknowledged: false
  },
  {
    id: 3,
    batteryId: 'BAT003',
    type: 'health',
    severity: 'warning',
    message: 'Battery health below 50%',
    timestamp: '2024-07-22T08:30:00Z',
    acknowledged: true
  }
];

// Generate historical data for charts
export const generateHistoricalData = (batteryId, dataType, hours = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const timeStr = time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    let value;
    switch (dataType) {
      case 'voltage':
        value = 11.5 + Math.random() * 1.5 + Math.sin(i / 4) * 0.3;
        break;
      case 'temperature':
        value = 20 + Math.random() * 15 + Math.sin(i / 6) * 5;
        break;
      case 'stateOfCharge':
        value = Math.max(10, 100 - (i * 2) + Math.random() * 10);
        break;
      case 'health':
        value = Math.max(40, 100 - (i * 0.5) + Math.random() * 5);
        break;
      default:
        value = Math.random() * 100;
    }
    
    data.push({
      time: timeStr,
      [dataType]: Math.round(value * 10) / 10
    });
  }
  
  return data;
};

export const mockCommands = [
  {
    id: 1,
    batteryId: 'BAT001',
    command: 'restart',
    status: 'completed',
    timestamp: '2024-07-22T09:45:00Z',
    executedBy: 'admin@bms.com'
  },
  {
    id: 2,
    batteryId: 'BAT002',
    command: 'shutdown',
    status: 'pending',
    timestamp: '2024-07-22T10:15:00Z',
    executedBy: 'admin@bms.com'
  }
];

// API simulation functions
export const getBatteriesByUser = (userId) => {
  return mockBatteries.filter(battery => battery.userId === userId);
};

export const getAllBatteries = () => {
  return mockBatteries;
};

export const getBatteryById = (batteryId) => {
  return mockBatteries.find(battery => battery.id === batteryId);
};

export const getLogsByBattery = (batteryId) => {
  return mockLogs.filter(log => log.batteryId === batteryId);
};

export const getActiveAlerts = () => {
  return mockAlerts.filter(alert => !alert.acknowledged);
};

export const getAllAlerts = () => {
  return mockAlerts;
};