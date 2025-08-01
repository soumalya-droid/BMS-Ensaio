import { useState, useEffect } from 'react';

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        setIsInstalled(true);
      }
    };

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    checkInstalled();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Install failed:', error);
      return false;
    }
  };

  return {
    isInstalled,
    isInstallable,
    installApp
  };
}

export function useServiceWorker() {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
      
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
          setIsRegistered(true);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }
  }, []);

  return {
    isSupported,
    isRegistered
  };
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      navigator.serviceWorker.ready.then((registration) => {
        return registration.pushManager.getSubscription();
      }).then((sub) => {
        if (sub) {
          setIsSubscribed(true);
          setSubscription(sub);
        }
      });
    }
  }, []);

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY') // Replace with actual VAPID key
      });
      
      setSubscription(subscription);
      setIsSubscribed(true);
      
      // Send subscription to your backend
      await fetch('/api/push-subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return true;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        setSubscription(null);
        
        // Notify backend
        await fetch('/api/push-unsubscribe', {
          method: 'POST',
          body: JSON.stringify({ endpoint: subscription.endpoint }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      return true;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscribeToPush,
    unsubscribeFromPush
  };
}

// Helper function for VAPID key conversion
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}