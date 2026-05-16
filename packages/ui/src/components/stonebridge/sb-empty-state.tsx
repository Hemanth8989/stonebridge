// @sb/ui — centered empty state pattern

'use client';

import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export interface SbEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  };
  className?: string;
}

export function SbEmptyState({ icon, title, description, action, className }: SbEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? (
        <div className="mt-6">
          <Button type="button" variant={action.variant ?? 'default'} onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
