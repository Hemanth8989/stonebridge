// @sb/ui — removable filter chip

'use client';

import { X } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

export interface SbFilterBadgeProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

export function SbFilterBadge({ label, onRemove, className }: SbFilterBadgeProps) {
  return (
    <Badge variant="outline" className={cn('gap-1 pr-1 font-normal', className)}>
      <span className="max-w-[220px] truncate">{label}</span>
      <button
        type="button"
        className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </Badge>
  );
}
