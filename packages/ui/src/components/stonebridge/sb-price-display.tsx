// @sb/ui — formatted currency display

'use client';

import { formatCurrency } from '@sb/utils';

import { cn } from '../../lib/utils';

export interface SbPriceDisplayProps {
  amount: number;
  currency?: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<SbPriceDisplayProps['size']>, string> = {
  sm: 'text-sm font-medium',
  md: 'text-lg font-semibold',
  lg: 'text-2xl font-semibold',
};

const unitClasses: Record<NonNullable<SbPriceDisplayProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
};

export function SbPriceDisplay({
  amount,
  currency,
  unit,
  size = 'md',
  muted = false,
  className,
}: SbPriceDisplayProps) {
  const formatted = formatCurrency(amount, currency);

  return (
    <div className={cn('inline-flex flex-col items-baseline gap-0.5', className)}>
      <span
        className={cn(
          sizeClasses[size],
          muted ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {formatted}
      </span>
      {unit ? (
        <span className={cn('font-normal text-muted-foreground', unitClasses[size])}>
          {`/${unit}`}
        </span>
      ) : null}
    </div>
  );
}
