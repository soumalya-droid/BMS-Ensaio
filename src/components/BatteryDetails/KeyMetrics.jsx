import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Zap, Thermometer, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Metric = ({ icon: Icon, title, value, unit, gradient }) => (
  <Card className="metric-card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const KeyMetrics = ({ battery }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
  >
    <Metric icon={Zap} title="Voltage" value={battery.voltage} unit="V" gradient="from-blue-500 to-blue-600" />
    <Metric icon={Thermometer} title="Temperature" value={battery.temperature} unit="°C" gradient="from-orange-500 to-red-600" />
    <Metric icon={Activity} title="Health" value={battery.health} unit="%" gradient="from-green-500 to-green-600" />
    <Metric icon={Battery} title="Charge Level" value={battery.stateOfCharge} unit="%" gradient="from-purple-500 to-purple-600" />
  </motion.div>
);

export default KeyMetrics;