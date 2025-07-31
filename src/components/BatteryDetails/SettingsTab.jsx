import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const SettingsTab = ({ battery, onCommand }) => (
  <TabsContent value="settings" className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Battery Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Battery ID</p>
            <p className="text-lg font-semibold">{battery.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Cycle Count</p>
            <p className="text-lg font-semibold">{battery.cycleCount}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Last Update</p>
            <p className="text-lg font-semibold">
              {new Date(battery.lastUpdate).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">State of Charge</p>
            <p className="text-lg font-semibold">{battery.stateOfCharge}%</p>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Remote Controls</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => onCommand('Calibrate')}
            >
              Calibrate
            </Button>
            <Button 
              variant="outline"
              onClick={() => onCommand('Reset')}
            >
              Reset
            </Button>
            <Button 
              variant="outline"
              onClick={() => onCommand('Update Firmware')}
            >
              Update Firmware
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

export default SettingsTab;