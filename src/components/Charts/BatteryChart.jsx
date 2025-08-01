import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const lineColors = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"];

export default function BatteryChart({ data, title, dataKey, color = "#3b82f6", type = "line" }) {
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {`${p.name}: ${p.value}${title.includes('Temp') ? '°C' : title.includes('Voltage') ? 'V' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
              <AreaChart data={data}>
                <defs>
                  {dataKeys.map((key, i) => (
                    <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1" key={i}>
                      <stop offset="5%" stopColor={color || lineColors[i % lineColors.length]} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={color || lineColors[i % lineColors.length]} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" className="text-xs" tick={{ fontSize: 12 }}/>
                <YAxis className="text-xs" tick={{ fontSize: 12 }}/>
                <Tooltip content={<CustomTooltip />} />
                {dataKeys.map((key, i) => (
                  <Area
                    key={i}
                    type="monotone"
                    dataKey={key}
                    stroke={color || lineColors[i % lineColors.length]}
                    fillOpacity={1}
                    fill={`url(#gradient-${key})`}
                    strokeWidth={2}
                    name={key}
                  />
                ))}
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" className="text-xs" tick={{ fontSize: 12 }}/>
                <YAxis className="text-xs" tick={{ fontSize: 12 }}/>
                <Tooltip content={<CustomTooltip />} />
                {dataKeys.map((key, i) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={key}
                    stroke={color || lineColors[i % lineColors.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name={key}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}