// @sb/ui — StoneBridge domain status badges

'use client';

import type { POStatus, SlabStatus, VariantStatus } from '@sb/types';
import {
  getPoStatusColor,
  getPoStatusLabel,
  getSlabStatusColor,
  getSlabStatusLabel,
  getVariantStatusColor,
  getVariantStatusLabel,
} from '@sb/utils';

import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

function mapStatusColorClasses(color: 'green' | 'amber' | 'blue' | 'red' | 'gray'): string {
  const map: Record<'green' | 'amber' | 'blue' | 'red' | 'gray', string> = {
    green:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    amber:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    blue:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    gray:
      'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  };
  return map[color];
}

export function POStatusBadge({ status }: { status: POStatus }) {
  const color = getPoStatusColor(status);
  return (
    <Badge variant="outline" className={cn(mapStatusColorClasses(color))}>
      {getPoStatusLabel(status)}
    </Badge>
  );
}

export function SlabStatusBadge({ status }: { status: SlabStatus }) {
  const color = getSlabStatusColor(status);
  return (
    <Badge variant="outline" className={cn(mapStatusColorClasses(color))}>
      {getSlabStatusLabel(status)}
    </Badge>
  );
}

export function VariantStatusBadge({ status }: { status: VariantStatus }) {
  const color = getVariantStatusColor(status);
  return (
    <Badge variant="outline" className={cn(mapStatusColorClasses(color))}>
      {getVariantStatusLabel(status)}
    </Badge>
  );
}
