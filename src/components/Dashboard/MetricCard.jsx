import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function MetricCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendValue, 
  className,
  gradient = "from-blue-500 to-purple-600"
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("metric-card", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold">{value}</span>
                {unit && (
                  <span className="text-sm text-muted-foreground">{unit}</span>
                )}
              </div>
              {trend && (
                <div className={cn(
                  "flex items-center space-x-1 mt-2 text-xs",
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500' : 'text-yellow-500'
                )}>
                  <span>{trendValue}</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              )}
            </div>
            
            {Icon && (
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                `bg-gradient-to-br ${gradient}`
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}