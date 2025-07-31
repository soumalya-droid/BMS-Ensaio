import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Battery, Download, Power, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const getStatusColor = (status) => {
  switch (status) {
    case 'online': return 'bg-green-500';
    case 'offline': return 'bg-red-500';
    case 'warning': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

const DetailsHeader = ({ battery, onExport, onCommand }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Battery className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Battery {battery.id}</h1>
            <p className="text-muted-foreground">{battery.location}</p>
          </div>
        </div>
        
        <Badge 
          variant="outline" 
          className={`text-white border-0 ${getStatusColor(battery.status)}`}
        >
          {battery.status}
        </Badge>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline"
          onClick={onExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
        <Button 
          variant="outline"
          onClick={() => onCommand('Restart')}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
        <Button 
          variant="destructive"
          onClick={() => onCommand('Shutdown')}
        >
          <Power className="w-4 h-4 mr-2" />
          Shutdown
        </Button>
      </div>
    </motion.div>
  );
};

export default DetailsHeader;