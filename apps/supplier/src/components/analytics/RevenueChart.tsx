import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton, SbEmptyState } from '@sb/ui';
import { formatCurrency, formatCurrencyCompact } from '@sb/utils';
import { BarChart3 } from 'lucide-react';

interface RevenueChartProps {
  data?: Array<{ month: string; revenue: number }>;
  loading?: boolean;
}

export default function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return <Skeleton className="w-full h-[280px]" />;
  }

  if (!data || data.length === 0) {
    return <SbEmptyState icon={<BarChart3 className="w-6 h-6" />} title="No data" description="Not enough data to display chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }} 
          className="text-muted-foreground" 
          axisLine={false}
          tickLine={false}
          dy={10}
        />
        <YAxis 
          tickFormatter={(v) => formatCurrencyCompact(v)} 
          tick={{ fontSize: 12 }} 
          className="text-muted-foreground"
          axisLine={false}
          tickLine={false}
          dx={-10}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), 'Revenue']}
          contentStyle={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
          cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
        />
        <Bar 
          dataKey="revenue" 
          fill="hsl(var(--primary))" 
          radius={[4, 4, 0, 0]} 
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
