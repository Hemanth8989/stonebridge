// @sb/ui — KPI / metric card

'use client';

import type { ReactNode } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export interface SbStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string; direction: 'up' | 'down' | 'neutral' };
  loading?: boolean;
  className?: string;
}

export function SbStatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  loading = false,
  className,
}: SbStatCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight text-foreground">{value}</div>
            )}
            {subtitle && !loading ? (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
            {trend && !loading ? (
              <div className="flex items-center gap-2 text-sm">
                {trend.direction === 'up' ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden />
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {trend.value}%
                    </span>
                  </>
                ) : trend.direction === 'down' ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden />
                    <span className="font-medium text-red-600 dark:text-red-400">{trend.value}%</span>
                  </>
                ) : (
                  <span className="font-medium text-muted-foreground">{trend.value}%</span>
                )}
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            ) : null}
          </div>
          {icon ? (
            <div className="rounded-md border bg-muted/40 p-2 text-muted-foreground">{icon}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
