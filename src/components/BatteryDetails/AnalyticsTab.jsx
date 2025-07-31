import React from 'react';
import BatteryChart from '@/components/Charts/BatteryChart';
import { TabsContent } from '@/components/ui/tabs';

const AnalyticsTab = ({ voltageData, temperatureData, healthData }) => (
  <TabsContent value="analytics" className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BatteryChart
        data={voltageData}
        title="Voltage Trends (24h)"
        dataKey="voltage"
        color="#3b82f6"
        type="area"
      />
      <BatteryChart
        data={temperatureData}
        title="Temperature Trends (24h)"
        dataKey="temperature"
        color="#f59e0b"
        type="line"
      />
    </div>
    
    <BatteryChart
      data={healthData}
      title="Health Trends (24h)"
      dataKey="health"
      color="#10b981"
      type="area"
    />
  </TabsContent>
);

export default AnalyticsTab;