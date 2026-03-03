'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PredictionTimelineChartProps {
  disease?: string;
}

const generateData = () => {
  const weeks = [];
  const today = new Date();
  
  // Historical data (8 weeks)
  for (let i = -8; i < 0; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + (i * 7));
    weeks.push({
      week: `${date.getDate()}/${date.getMonth() + 1}`,
      historical: Math.floor(Math.random() * 500) + 2500,
      predicted: null,
      isPrediction: false,
    });
  }
  
  // Current week
  weeks.push({
    week: 'Hoy',
    historical: 3104,
    predicted: 3104,
    isPrediction: false,
  });
  
  // Predictions (4 weeks)
  const predictions = [3400, 3800, 4200, 4630];
  for (let i = 1; i <= 4; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + (i * 7));
    weeks.push({
      week: `+${i}s`,
      historical: null,
      predicted: predictions[i - 1],
      isPrediction: true,
    });
  }
  
  return weeks;
};

export default function PredictionTimelineChart({ disease = 'Dengue' }: PredictionTimelineChartProps) {
  const data = generateData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.2} />
        <XAxis 
          dataKey="week" 
          stroke="var(--text-secondary)"
          fontSize={10}
          tickLine={false}
        />
        <YAxis 
          stroke="var(--text-secondary)"
          fontSize={10}
          tickLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--card-bg)', 
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '12px'
          }}
          formatter={(value: number) => [`${value.toLocaleString()} casos`, '']}
        />
        <ReferenceLine x="Hoy" stroke="var(--text-secondary)" strokeDasharray="3 3" />
        <Area 
          type="monotone" 
          dataKey="historical" 
          stroke="#F59E0B" 
          strokeWidth={2}
          fill="url(#colorHistorical)"
          name="Histórico"
        />
        <Area 
          type="monotone" 
          dataKey="predicted" 
          stroke="#EF4444" 
          strokeWidth={2}
          strokeDasharray="5 5"
          fill="url(#colorPredicted)"
          name="Predicción"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
