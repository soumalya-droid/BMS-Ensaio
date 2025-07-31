import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import DetailsHeader from '@/components/BatteryDetails/DetailsHeader';
import KeyMetrics from '@/components/BatteryDetails/KeyMetrics';
import AnalyticsTab from '@/components/BatteryDetails/AnalyticsTab';
import LocationTab from '@/components/BatteryDetails/LocationTab';
import LogsTab from '@/components/BatteryDetails/LogsTab';
import SettingsTab from '@/components/BatteryDetails/SettingsTab';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBatteryById, getLogsByBattery, generateHistoricalData } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';

export default function BatteryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [battery, setBattery] = useState(null);
  const [logs, setLogs] = useState([]);
  const [voltageData, setVoltageData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    const batteryData = getBatteryById(id);
    if (!batteryData) {
      toast({ title: "Battery not found", variant: "destructive" });
      navigate('/dashboard');
      return;
    }

    setBattery(batteryData);
    setLogs(getLogsByBattery(id));
    setVoltageData(generateHistoricalData(id, 'voltage'));
    setTemperatureData(generateHistoricalData(id, 'temperature'));
    setHealthData(generateHistoricalData(id, 'health'));
  }, [id, navigate]);

  const handleRemoteCommand = (command) => {
    toast({
      title: `🔧 Remote ${command}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleExportData = () => {
    toast({
      title: "📊 Export Data",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  if (!battery) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading battery details...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Helmet>
        <title>Battery {battery.id} - BMS</title>
        <meta name="description" content={`Detailed monitoring for Battery ${battery.id}.`} />
      </Helmet>
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <DetailsHeader 
            battery={battery} 
            onExport={handleExportData}
            onCommand={handleRemoteCommand}
          />

          <KeyMetrics battery={battery} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="analytics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="logs">Event Logs</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <AnalyticsTab 
                voltageData={voltageData}
                temperatureData={temperatureData}
                healthData={healthData}
              />
              <LocationTab battery={battery} />
              <LogsTab logs={logs} />
              <SettingsTab battery={battery} onCommand={handleRemoteCommand} />
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}