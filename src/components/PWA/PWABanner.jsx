import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA, usePushNotifications } from '@/hooks/usePWA';

export default function PWABanner() {
  const { isInstalled, isInstallable, installApp } = usePWA();
  const { isSupported: pushSupported, isSubscribed, subscribeToPush } = usePushNotifications();

  if (isInstalled && isSubscribed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Get the Mobile Experience</h3>
            <p className="text-sm text-blue-100">
              {!isInstalled && isInstallable && "Install our app for faster access and offline capabilities"}
              {isInstalled && !isSubscribed && "Enable notifications for instant battery alerts"}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!isInstalled && isInstallable && (
            <Button
              variant="secondary"
              size="sm"
              onClick={installApp}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-1" />
              Install App
            </Button>
          )}
          
          {isInstalled && !isSubscribed && pushSupported && (
            <Button
              variant="secondary"
              size="sm"
              onClick={subscribeToPush}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Bell className="w-4 h-4 mr-1" />
              Enable Alerts
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}