import React from 'react';
import { Image, MoreHorizontal } from 'lucide-react';
import { SbDataTable, SlabStatusBadge, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@sb/ui';
import { formatCurrency, formatDimensions, formatArea } from '@sb/utils';
import type { Slab, SlabStatus } from '@sb/types';
import SlabStatusMenu from './SlabStatusMenu';

interface SlabTableProps {
  slabs: Slab[];
  loading?: boolean;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: SlabStatus) => void;
  onDelete: (id: string) => void;
}

export default function SlabTable({ slabs, loading, onEdit, onStatusChange, onDelete }: SlabTableProps) {
  return (
    <SbDataTable
      loading={loading}
      data={slabs}
      keyExtractor={(row) => row.id}
      columns={[
        {
          key: 'photo',
          header: '',
          render: (slab: any) => (
            <div className="w-12 h-12 rounded bg-muted overflow-hidden flex items-center justify-center border border-border">
              {slab.primaryPhotoUrl ? (
                <img src={slab.primaryPhotoUrl} alt="" className="object-cover w-full h-full" />
              ) : (
                <Image className="w-5 h-5 text-muted-foreground opacity-30" />
              )}
            </div>
          ),
        },
        {
          key: 'ref',
          header: 'Ref',
          render: (slab) => <span className="font-mono text-xs">{slab.internalRef}</span>,
        },
        {
          key: 'material',
          header: 'Material',
          render: (slab) => (
            <div>
              <div className="font-medium text-sm text-foreground">{slab.materialName}</div>
              {slab.colorFamily && <div className="text-xs text-muted-foreground">{slab.colorFamily}</div>}
            </div>
          ),
        },
        {
          key: 'specs',
          header: 'Specs',
          render: (slab) => (
            <div className="text-sm">
              <div>{slab.thicknessCm}cm {slab.finish}</div>
              {slab.pattern && <div className="text-xs text-muted-foreground">{slab.pattern}</div>}
            </div>
          ),
        },
        {
          key: 'dimensions',
          header: 'Dimensions',
          render: (slab) => (
            <div className="text-sm">
              <div>{formatDimensions(slab.grossLengthMm, slab.grossWidthMm)}</div>
              <div className="text-xs text-muted-foreground">{formatArea(slab.grossLengthMm, slab.grossWidthMm)}</div>
            </div>
          ),
        },
        {
          key: 'price',
          header: 'Price',
          render: (slab: any) => (
            <div className="text-right text-sm">
              <div className="font-medium">{formatCurrency(slab.priceOverride ?? slab.listPrice ?? slab.basePrice ?? 0)}/sq ft</div>
            </div>
          ),
        },
        {
          key: 'quality',
          header: 'Quality',
          render: (slab) => {
            if (!slab.qualityGrade) return '-';
            const colors = { A: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', B: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300', C: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
            const grade = slab.qualityGrade as 'A'|'B'|'C';
            return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[grade] || ''}`}>{slab.qualityGrade}</span>;
          },
        },
        {
          key: 'rack',
          header: 'Location',
          render: (slab) => <span className="font-mono text-xs text-muted-foreground">{slab.rackLocation || '-'}</span>,
        },
        {
          key: 'status',
          header: 'Status',
          render: (slab) => <SlabStatusBadge status={slab.status} />,
        },
        {
          key: 'actions',
          header: '',
          render: (slab) => (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(slab.id)}>Edit details</DropdownMenuItem>
                  <SlabStatusMenu currentStatus={slab.status} onStatusChange={(s) => onStatusChange(slab.id, s)} />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(slab.id)}>
                    Delete slab
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        },
      ]}
    />
  );
}
