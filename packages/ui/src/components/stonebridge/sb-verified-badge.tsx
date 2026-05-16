// @sb/ui — verified supplier badge

'use client';

import { ShieldCheck } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

export interface SbVerifiedBadgeProps {
  verified: boolean;
  size?: 'sm' | 'md';
}

const sizeClasses: Record<NonNullable<SbVerifiedBadgeProps['size']>, string> = {
  sm: 'gap-1 px-2 py-0.5 text-[10px]',
  md: 'gap-1.5 px-2.5 py-1 text-xs',
};

export function SbVerifiedBadge({ verified, size = 'md' }: SbVerifiedBadgeProps) {
  if (!verified) {
    return null;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300',
        sizeClasses[size],
      )}
      aria-label="Verified supplier"
    >
      <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Verified
    </Badge>
  );
}
