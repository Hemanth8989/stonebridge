// @sb/ui — typed data table shell

'use client';

import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';
import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { SbEmptyState } from './sb-empty-state';

export interface Column<T> {
  key: string;
  header: string | ReactNode;
  render: (item: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface SbDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  className?: string;
}

function skeletonRows(columnCount: number) {
  return Array.from({ length: 5 }, (_, rowIdx) => (
    <TableRow key={`sb-skeleton-${String(rowIdx)}`}>
      {Array.from({ length: columnCount }, (_, colIdx) => (
        <TableCell key={`sb-skeleton-${String(rowIdx)}-${String(colIdx)}`}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function SbDataTable<T>({
  columns,
  data,
  loading = false,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  emptyIcon,
  keyExtractor,
  onRowClick,
  className,
}: SbDataTableProps<T>) {
  const clickable = typeof onRowClick === 'function';

  const alignClass = (align?: Column<T>['align']) =>
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(alignClass(col.align), col.headerClassName)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            skeletonRows(columns.length)
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                <SbEmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const rowKey = keyExtractor(item);
              return (
                <TableRow
                  key={rowKey}
                  className={cn(clickable ? 'cursor-pointer hover:bg-muted/50' : '')}
                  onClick={() => {
                    if (clickable) {
                      onRowClick(item);
                    }
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={`${rowKey}:${col.key}`}
                      className={cn('text-foreground', alignClass(col.align), col.className)}
                    >
                      {col.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
