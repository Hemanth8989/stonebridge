// @sb/ui — search input with iconography

'use client';

import { Search, X } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export interface SbSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export function SbSearchInput({
  value,
  onChange,
  placeholder,
  className,
  onClear,
}: SbSearchInputProps) {
  const showClear = value.length > 0 && typeof onClear === 'function';

  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn('pl-9', showClear ? 'pr-10' : '')}
        aria-label={placeholder ?? 'Search'}
      />
      {showClear ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
          onClick={() => onClear()}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
