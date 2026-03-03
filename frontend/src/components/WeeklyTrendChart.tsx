'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface WeeklyTrendChartProps {
  data?: Array<{ week: string; cases: number | null; predicted?: number | null }>;
}

const defaultData = [
  { week: 'Sem 1', cases: 12, predicted: undefined },
  { week: 'Sem 2', cases: 15, predicted: undefined },
  { week: 'Sem 3', cases: 18, predicted: undefined },
  { week: 'Sem 4', cases: 14, predicted: undefined },
  { week: 'Sem 5', cases: 16, predicted: undefined },
  { week: 'Sem 6', cases: 19, predicted: undefined },
  { week: 'Sem 7', cases: 22, predicted: undefined },
  { week: 'Sem 8', cases: 20, predicted: 20 },
  { week: 'Sem 9', cases: null, predicted: 23 },
  { week: 'Sem 10', cases: null, predicted: 25 },
  { week: 'Sem 11', cases: null, predicted: 27 },
  { week: 'Sem 12', cases: null, predicted: 29 },
];

export default function WeeklyTrendChart({ data = defaultData }: WeeklyTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
        <XAxis 
          dataKey="week" 
          stroke="var(--text-secondary)" 
          fontSize={11}
          tickLine={false}
        />
        <YAxis 
          stroke="var(--text-secondary)" 
          fontSize={11}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--card-bg)', 
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="cases" 
          stroke="#F59E0B" 
          strokeWidth={3}
          dot={{ fill: '#F59E0B', r: 4 }}
          name="Casos Reales"
        />
        <Line 
          type="monotone" 
          dataKey="predicted" 
          stroke="#EF4444" 
          strokeWidth={3}
          strokeDasharray="5 5"
          dot={{ fill: '#EF4444', r: 4 }}
          name="Predicción"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
