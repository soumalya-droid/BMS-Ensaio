import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';

export default function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();
    if (success) {
      setIsDismissed(true);
    }
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (!isInstallable || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
      >
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  Install BMS App
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Get quick access to your battery dashboard. Install our app for the best mobile experience.
                </p>
                
                <div className="flex items-center space-x-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isInstalling ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-1" />
                        Install
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Later
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="p-0 h-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}