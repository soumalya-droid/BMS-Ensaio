import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

const LocationTab = ({ battery }) => (
  <TabsContent value="location" className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>GPS Location</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Latitude</p>
            <p className="text-lg font-semibold">{battery.latitude}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Longitude</p>
            <p className="text-lg font-semibold">{battery.longitude}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
          <p className="text-lg font-semibold">{battery.location}</p>
        </div>
        
        <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-semibold mb-2">Interactive Map</p>
            <p className="text-sm text-muted-foreground">Click to view full map with route history</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

export default LocationTab;