import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Battery, 
  Zap, 
  Thermometer, 
  Activity,
  AlertTriangle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import MetricCard from '@/components/Dashboard/MetricCard';
import BatteryCard from '@/components/Dashboard/BatteryCard';
import BatteryMap from '@/components/Dashboard/BatteryMap';
import BatteryChart from '@/components/Charts/BatteryChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { getBatteriesByUser, getActiveAlerts, generateHistoricalData } from '@/data/mockData';

export default function UserDashboard({ demo, sampleUser = {}, sampleBatteries = [], sampleAlerts = [] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [batteries, setBatteries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const { user } = demo ? { user: sampleUser } : useAuth();
  const navigate = demo ? () => {} : useNavigate();

  useEffect(() => {
    if (demo) {
      setBatteries(sampleBatteries);
      setAlerts(sampleAlerts);
      setChartData([]); // Optionally add static chart data for demo
    } else {
      // Load user's batteries
      const userBatteries = getBatteriesByUser(user.id);
      setBatteries(userBatteries);
      // Load active alerts for user's batteries
      const allAlerts = getActiveAlerts();
      const userAlerts = allAlerts.filter(alert =>
        userBatteries.some(battery => battery.id === alert.batteryId)
      );
      setAlerts(userAlerts);
      // Generate chart data for the first battery
      if (userBatteries.length > 0) {
        const data = generateHistoricalData(userBatteries[0].id, 'voltage');
        setChartData(data);
      }
    }
  }, [demo, sampleBatteries, sampleAlerts, sampleUser, user.id]);

  const handleViewBatteryDetails = (batteryId) => {
    if (!demo) navigate(`/battery/${batteryId}`);
  };

  // Calculate metrics
  const totalBatteries = batteries.length;
  const onlineBatteries = batteries.filter(b => b.status === 'online').length;
  const avgHealth = batteries.length > 0 
    ? Math.round(batteries.reduce((sum, b) => sum + b.health, 0) / batteries.length)
    : 0;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>User Dashboard - Battery Management System</title>
        <meta name="description" content="Monitor your battery performance, health metrics, and receive real-time alerts on your personal BMS dashboard." />
      </Helmet>
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">
              Here's an overview of your battery systems
            </p>
          </motion.div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Alert variant={alerts.some(a => a.severity === 'critical') ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Active Alerts</AlertTitle>
                <AlertDescription>
                  You have {alerts.length} active alert{alerts.length !== 1 ? 's' : ''} requiring attention.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <MetricCard
              title="Total Batteries"
              value={totalBatteries}
              icon={Battery}
              gradient="from-blue-500 to-blue-600"
            />
            <MetricCard
              title="Online"
              value={onlineBatteries}
              unit={`/ ${totalBatteries}`}
              icon={Zap}
              trend="up"
              trendValue="+2"
              gradient="from-green-500 to-green-600"
            />
            <MetricCard
              title="Avg Health"
              value={avgHealth}
              unit="%"
              icon={Activity}
              trend={avgHealth > 80 ? 'up' : avgHealth > 60 ? 'stable' : 'down'}
              trendValue={avgHealth > 80 ? '+5%' : avgHealth > 60 ? '0%' : '-3%'}
              gradient="from-purple-500 to-purple-600"
            />
            <MetricCard
              title="Critical Alerts"
              value={criticalAlerts}
              icon={AlertTriangle}
              gradient="from-red-500 to-red-600"
            />
          </motion.div>

          {/* Charts and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BatteryChart
                data={chartData}
                title="Voltage Trends (24h)"
                dataKey="voltage"
                color="#3b82f6"
                type="area"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <BatteryMap batteries={batteries} />
            </motion.div>
          </div>

          {/* Battery Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Batteries</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{batteries.length} batteries tracked</span>
              </div>
            </div>

            {batteries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batteries.map((battery, index) => (
                  <motion.div
                    key={battery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <BatteryCard
                      battery={battery}
                      onViewDetails={handleViewBatteryDetails}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Battery className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Batteries Found</h3>
                  <p className="text-muted-foreground text-center">
                    You don't have any batteries registered yet. Contact your administrator to add batteries to your account.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}