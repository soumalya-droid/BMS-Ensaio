import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Battery, 
  MapPin, 
  Thermometer, 
  Zap, 
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

export default function BatteryCard({ battery, onViewDetails }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'warning': return 'Warning';
      default: return 'Unknown';
    }
  };

  const getBatteryLevel = (voltage) => {
    // Simple voltage to percentage conversion (adjust based on battery specs)
    const minVoltage = 10.5;
    const maxVoltage = 12.6;
    return Math.max(0, Math.min(100, ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100));
  };

  const handleRemoteCommand = (command) => {
    toast({
      title: `🔧 Remote ${command}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Battery className="w-5 h-5" />
              <span>Battery {battery.id}</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={cn("text-white border-0", getStatusColor(battery.status))}
              >
                {getStatusText(battery.status)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoteCommand('menu')}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Battery Level */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Charge Level</span>
              <span>{getBatteryLevel(battery.voltage).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getBatteryLevel(battery.voltage)}%` }}
              />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Voltage</p>
                <p className="text-sm font-semibold">{battery.voltage}V</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-sm font-semibold">{battery.temperature}°C</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-semibold truncate">
                {battery.location || `${battery.latitude}, ${battery.longitude}`}
              </p>
            </div>
          </div>

          {/* Health Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                battery.health > 80 ? 'bg-green-500' :
                battery.health > 60 ? 'bg-yellow-500' : 'bg-red-500'
              )} />
              <span className="text-sm">Health: {battery.health}%</span>
            </div>
            
            {battery.health < 70 && (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails(battery.id)}
            >
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleRemoteCommand('restart')}
            >
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}