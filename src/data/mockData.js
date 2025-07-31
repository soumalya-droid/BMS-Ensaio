const API_URL = 'http://localhost:4000/api';

// Keep mock users for now, as there is no user management API yet
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

export const getBatteriesByUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/batteries`);
    if (!response.ok) throw new Error('Failed to fetch batteries');
    const data = await response.json();
    // The backend does not filter by user yet, so we return all batteries
    return data;
  } catch (error) {
    console.error('Error fetching batteries:', error);
    return []; // Return empty array on error
  }
};

export const getAllBatteries = async () => {
  try {
    const response = await fetch(`${API_URL}/batteries`);
    if (!response.ok) throw new Error('Failed to fetch batteries');
    return await response.json();
  } catch (error) {
    console.error('Error fetching all batteries:', error);
    return [];
  }
};

export const getBatteryById = async (batteryId) => {
  try {
    const response = await fetch(`${API_URL}/batteries/${batteryId}`);
    if (!response.ok) throw new Error('Failed to fetch battery');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching battery ${batteryId}:`, error);
    return null; // Return null on error
  }
};

export const getLogsByBattery = async (batteryId) => {
  try {
    const response = await fetch(`${API_URL}/batteries/${batteryId}/logs`);
    if (!response.ok) throw new Error('Failed to fetch logs');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching logs for battery ${batteryId}:`, error);
    return [];
  }
};

export const generateHistoricalData = async (batteryId, dataType) => {
  try {
    const response = await fetch(`${API_URL}/batteries/${batteryId}/historical?metric=${dataType}`);
    if (!response.ok) throw new Error('Failed to fetch historical data');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching historical data for ${dataType}:`, error);
    return [];
  }
};

export const getActiveAlerts = () => {
  // No backend endpoint for alerts yet, return empty array
  return [];
};

export const getAllAlerts = () => {
  // No backend endpoint for alerts yet, return empty array
  return [];
};

// Mock commands can remain as they are not used in a way that requires a backend
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