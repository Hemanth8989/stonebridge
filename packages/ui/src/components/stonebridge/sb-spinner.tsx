// @sb/ui — loading spinner (Lucide)

'use client';

import { Loader2 } from 'lucide-react';

import { cn } from '../../lib/utils';

export interface SbSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses: Record<NonNullable<SbSpinnerProps['size']>, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
};

export function SbSpinner({ size = 'md', className, label }: SbSpinnerProps) {
  return (
    <div role="status" className={cn('inline-flex items-center justify-center', className)}>
      <Loader2
        className={cn('animate-spin text-muted-foreground', sizeClasses[size])}
        aria-hidden
      />
      <span className="sr-only">{label ?? 'Loading...'}</span>
    </div>
  );
}
