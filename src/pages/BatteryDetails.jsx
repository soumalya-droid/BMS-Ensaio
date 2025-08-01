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
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function BatteryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [battery, setBattery] = useState(null);
  const [logs, setLogs] = useState([]);
  const [voltageData, setVoltageData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [chargeData, setChargeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [
          batteryResponse,
          logsResponse,
          voltageResponse,
          temperatureResponse,
          healthResponse,
          chargeResponse,
        ] = await Promise.all([
          fetch(`http://localhost:4000/api/batteries/${id}`),
          fetch(`http://localhost:4000/api/batteries/${id}/logs`),
          fetch(`http://localhost:4000/api/batteries/${id}/historical?metric=voltage`),
          fetch(`http://localhost:4000/api/batteries/${id}/historical?metric=temperature`),
          fetch(`http://localhost:4000/api/batteries/${id}/historical?metric=health`),
          fetch(
            `http://localhost:4000/api/batteries/${id}/historical?metric=stateOfCharge`
          ),
        ]);

        if (!batteryResponse.ok) {
          if (batteryResponse.status === 404) {
            toast({ title: "Battery not found", variant: "destructive" });
            navigate('/dashboard');
          } else {
            throw new Error('Failed to fetch battery details');
          }
          return;
        }

        const batteryData = await batteryResponse.json();
        setBattery(batteryData);

        if (logsResponse.ok) setLogs(await logsResponse.json());
        if (voltageResponse.ok) setVoltageData(await voltageResponse.json());
        if (temperatureResponse.ok) setTemperatureData(await temperatureResponse.json());
        if (healthResponse.ok) setHealthData(await healthResponse.json());
        if (chargeResponse.ok) setChargeData(await chargeResponse.json());

      } catch (err) {
        setError(err.message);
        console.error("Error fetching battery details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoteCommand = (command) => {
    toast({
      title: `🔧 Remote ${command}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const handleExportData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/batteries/${id}/export`);
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `battery_${id}_export.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "✅ Export Successful",
        description: "The battery data has been downloaded.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "❌ Export Failed",
        description: "Could not export battery data.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-lg">Loading battery details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!battery) {
    // This case should ideally be handled by the 404 redirection,
    // but as a fallback:
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-lg">Battery data could not be loaded.</p>
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
                chargeData={chargeData}
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