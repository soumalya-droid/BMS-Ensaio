import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Battery, 
  Users, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  MapPin,
  Shield,
  Zap
} from 'lucide-react';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import MetricCard from '@/components/Dashboard/MetricCard';
import BatteryCard from '@/components/Dashboard/BatteryCard';
import BatteryMap from '@/components/Dashboard/BatteryMap';
import BatteryChart from '@/components/Charts/BatteryChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { getAllBatteries, mockUsers, getActiveAlerts, generateHistoricalData } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

export default function AdminDashboard({ demo, sampleUsers = [], sampleBatteries = [], sampleAlerts = [] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [batteries, setBatteries] = useState([]);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const { user } = demo ? { user: { name: 'Admin User', role: 'admin' } } : useAuth();
  const navigate = demo ? () => {} : useNavigate();

  useEffect(() => {
    if (demo) {
      setBatteries(sampleBatteries);
      setUsers(sampleUsers);
      setAlerts(sampleAlerts);
      setChartData([]); // Optionally add static chart data for demo
    } else {
      setBatteries(getAllBatteries());
      setUsers(mockUsers);
      setAlerts(getActiveAlerts());
      const data = generateHistoricalData('SYSTEM', 'voltage');
      setChartData(data);
    }
  }, [demo, sampleBatteries, sampleUsers, sampleAlerts]);

  const handleViewBatteryDetails = (batteryId) => {
    if (!demo) navigate(`/battery/${batteryId}`);
  };

  const handleUserAction = (action, userId) => {
    toast({
      title: `👤 User ${action}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleSystemAction = (action) => {
    toast({
      title: `⚙️ System ${action}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  // Calculate admin metrics
  const totalBatteries = batteries.length;
  const onlineBatteries = batteries.filter(b => b.status === 'online').length;
  const totalUsers = users.filter(u => u.role === 'user').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const avgSystemHealth = batteries.length > 0 
    ? Math.round(batteries.reduce((sum, b) => sum + b.health, 0) / batteries.length)
    : 0;

  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>Admin Dashboard - Battery Management System</title>
        <meta name="description" content="Comprehensive admin dashboard for managing all batteries, users, and system operations in the Battery Management System." />
      </Helmet>
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Admin Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-500" />
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground">
                System-wide overview and management controls
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => handleSystemAction('Export Data')}
              >
                Export Data
              </Button>
              <Button onClick={() => handleSystemAction('System Settings')}>
                System Settings
              </Button>
            </div>
          </motion.div>

          {/* Admin Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            <MetricCard
              title="Total Batteries"
              value={totalBatteries}
              icon={Battery}
              gradient="from-blue-500 to-blue-600"
            />
            <MetricCard
              title="Online Batteries"
              value={onlineBatteries}
              unit={`/ ${totalBatteries}`}
              icon={Zap}
              trend="up"
              trendValue="+3"
              gradient="from-green-500 to-green-600"
            />
            <MetricCard
              title="Active Users"
              value={totalUsers}
              icon={Users}
              gradient="from-purple-500 to-purple-600"
            />
            <MetricCard
              title="System Health"
              value={avgSystemHealth}
              unit="%"
              icon={Activity}
              trend={avgSystemHealth > 80 ? 'up' : 'stable'}
              trendValue="+2%"
              gradient="from-indigo-500 to-indigo-600"
            />
            <MetricCard
              title="Critical Alerts"
              value={criticalAlerts}
              icon={AlertTriangle}
              gradient="from-red-500 to-red-600"
            />
          </motion.div>

          {/* Admin Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="batteries">All Batteries</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="alerts">Alerts & Logs</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BatteryChart
                    data={chartData}
                    title="System Voltage Trends (24h)"
                    dataKey="voltage"
                    color="#3b82f6"
                    type="area"
                  />
                  <BatteryMap batteries={batteries} />
                </div>
                
                {/* Recent Batteries */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Battery Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {batteries.slice(0, 6).map((battery) => (
                        <BatteryCard
                          key={battery.id}
                          battery={battery}
                          onViewDetails={handleViewBatteryDetails}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* All Batteries Tab */}
              <TabsContent value="batteries" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">All Batteries</h2>
                  <Button onClick={() => handleSystemAction('Add Battery')}>
                    Add New Battery
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {batteries.map((battery) => (
                    <BatteryCard
                      key={battery.id}
                      battery={battery}
                      onViewDetails={handleViewBatteryDetails}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* User Management Tab */}
              <TabsContent value="users" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <Button onClick={() => handleUserAction('Add', null)}>
                    Add New User
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr className="text-left">
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Batteries</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white">
                                      {user.name.charAt(0)}
                                    </span>
                                  </div>
                                  <span className="font-medium">{user.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground">{user.email}</td>
                              <td className="p-4">
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {batteries.filter(b => b.userId === user.id).length}
                              </td>
                              <td className="p-4">
                                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUserAction('Edit', user.id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUserAction('View', user.id)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Alerts Tab */}
              <TabsContent value="alerts" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">System Alerts</h2>
                  <Button onClick={() => handleSystemAction('Clear All Alerts')}>
                    Clear All
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {alerts.map((alert) => (
                    <Card key={alert.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              alert.severity === 'critical' ? 'bg-red-500' :
                              alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`} />
                            <div>
                              <p className="font-medium">{alert.message}</p>
                              <p className="text-sm text-muted-foreground">
                                Battery {alert.batteryId} • {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              alert.severity === 'critical' ? 'destructive' : 'secondary'
                            }>
                              {alert.severity}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSystemAction('Acknowledge Alert')}
                            >
                              Acknowledge
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}