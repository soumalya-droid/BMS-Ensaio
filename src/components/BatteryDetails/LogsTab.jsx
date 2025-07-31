import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const getLogColor = (eventType) => {
  if (eventType.includes('alert')) return 'bg-red-500';
  if (eventType.includes('warning')) return 'bg-yellow-500';
  return 'bg-green-500';
};

const LogsTab = ({ logs }) => (
  <TabsContent value="logs" className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Event Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getLogColor(log.eventType)}`} />
                <div>
                  <p className="font-medium">{log.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {log.eventType} • {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              {log.value != null && (
                <Badge variant="outline">
                  {log.value}
                  {log.eventType.includes('temperature') ? '°C' : 
                   log.eventType.includes('voltage') ? 'V' : 
                   log.eventType.includes('health') ? '%' : ''}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

export default LogsTab;