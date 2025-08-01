import React, { createContext, useContext, useEffect } from 'react';
import { useServiceWorker } from '@/hooks/usePWA';
import { toast } from '@/components/ui/use-toast';

const PWAContext = createContext();

export function usePWAContext() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWAContext must be used within a PWAProvider');
  }
  return context;
}

export function PWAProvider({ children }) {
  const { isSupported, isRegistered } = useServiceWorker();

  useEffect(() => {
    if (isRegistered) {
      console.log('Service Worker registered successfully');
      
      // Listen for service worker updates
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          toast({
            title: "App Updated",
            description: "The app has been updated. Refresh to get the latest version.",
            duration: 5000,
          });
        });
      }
    }
  }, [isRegistered]);

  const value = {
    isSupported,
    isRegistered
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
}