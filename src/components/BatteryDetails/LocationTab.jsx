import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationTab = ({ battery }) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    async function fetchRoute() {
      try {
        const response = await fetch(`http://localhost:4000/api/batteries/${battery.id}/route`);
        if (!response.ok) {
          throw new Error('Failed to fetch route data');
        }
        const data = await response.json();
        setRoute(data);
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    }
    fetchRoute();
  }, [battery.id]);

  const position = [battery.latitude, battery.longitude];

  return (
    <TabsContent value="location" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>GPS Location & Route</span>
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

          <div className="h-96 w-full">
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  Current location of Battery {battery.id}.
                </Popup>
              </Marker>
              {route.length > 0 && (
                <Polyline pathOptions={{ color: 'blue' }} positions={route} />
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default LocationTab;