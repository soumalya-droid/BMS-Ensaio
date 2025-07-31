import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getStatusColor = (status) => {
  switch (status) {
    case 'online': return 'green';
    case 'warning': return 'orange';
    case 'offline': return 'red';
    default: return 'gray';
  }
};

const CustomMarker = ({ battery }) => {
  const icon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:${getStatusColor(battery.status)};" class="w-4 h-4 rounded-full border-2 border-white"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  return (
    <Marker position={[battery.latitude, battery.longitude]} icon={icon}>
      <Popup>
        <strong>Battery ID:</strong> {battery.id} <br />
        <strong>Status:</strong> {battery.status}
      </Popup>
    </Marker>
  );
};

export default function BatteryMap({ batteries }) {
  const center = batteries.length > 0
    ? [batteries[0].latitude, batteries[0].longitude]
    : [40.7128, -74.0060]; // Default center

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Battery Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <MapContainer center={center} zoom={4} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {batteries.map(battery => (
              <CustomMarker key={battery.id} battery={battery} />
            ))}
          </MapContainer>
        </div>
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