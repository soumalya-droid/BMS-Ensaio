import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function BatteryMap({ batteries }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize map when component mounts
    initializeMap();
  }, []);

  const initializeMap = () => {
    // Simulate map initialization
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 100" class="w-full h-full">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          <div class="text-center z-10">
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <p class="text-lg font-semibold mb-2">Interactive Battery Map</p>
            <p class="text-sm text-muted-foreground">Click to view full map with real-time tracking</p>
          </div>
          ${batteries.map((battery, index) => `
            <div 
              class="absolute w-3 h-3 rounded-full ${battery.status === 'online' ? 'bg-green-500' : battery.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse"
              style="left: ${20 + (index * 15)}%; top: ${30 + (index * 10)}%;"
              title="Battery ${battery.id}"
            ></div>
          `).join('')}
        </div>
      `;
    }
  };

  const handleMapClick = () => {
    toast({
      title: "🗺️ Full Map View",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Battery Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef}
          className="h-64 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={handleMapClick}
        />
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Offline</span>
            </div>
          </div>
          <span className="text-muted-foreground">{batteries.length} batteries tracked</span>
        </div>
      </CardContent>
    </Card>
  );
}