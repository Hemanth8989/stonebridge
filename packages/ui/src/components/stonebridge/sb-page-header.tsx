// @sb/ui — page title region with optional breadcrumbs

'use client';

import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

export interface SbPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function SbPageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: SbPageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, idx) => (
              <li key={`${crumb.label}-${String(idx)}`} className="inline-flex items-center gap-2">
                {idx > 0 ? <span aria-hidden>/</span> : null}
                {crumb.href ? (
                  <a className="hover:text-foreground" href={crumb.href}>
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
