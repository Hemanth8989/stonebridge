import React from 'react';
import { Image } from 'lucide-react';
import { SbDataTable, SlabStatusBadge, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button, Badge } from '@sb/ui';
import { formatCurrency, formatDimensions } from '@sb/utils';
import type { POLineItem, POStatus } from '@sb/types';

interface POLineItemsTableProps {
  lineItems: POLineItem[];
  poStatus: POStatus;
  onLineAction?: (lineId: string, action: 'confirm' | 'decline' | 'substitute', data?: Record<string, unknown>) => void;
}

export default function POLineItemsTable({ lineItems, poStatus, onLineAction }: POLineItemsTableProps) {
  const showActions = poStatus === 'sent' || poStatus === 'partially_acked';

  const columns: any[] = [
    {
      key: 'photo',
      header: '',
      render: (line: POLineItem) => (
        <div className="w-12 h-12 rounded bg-muted overflow-hidden flex items-center justify-center border border-border">
          {line.itemSnapshot.primaryPhotoUrl ? (
            <img src={line.itemSnapshot.primaryPhotoUrl} alt="" className="object-cover w-full h-full" />
          ) : (
            <Image className="w-5 h-5 text-muted-foreground opacity-30" />
          )}
        </div>
      ),
    },
    {
      key: 'item',
      header: 'Item',
      render: (line: POLineItem) => {
        const item: any = line.itemSnapshot;
        return (
          <div>
            <div className="font-medium text-sm text-foreground">{item.materialName || item.name || 'Item'}</div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">{item.internalRef || item.skuOrRef || '-'}</div>
          </div>
        );
      },
    },
    {
      key: 'details',
      header: 'Details',
      render: (line: POLineItem) => {
        const item: any = line.itemSnapshot;
        return (
          <div className="text-sm">
            {item.thicknessCm ? (
              <>
                <div>{item.thicknessCm}cm {item.finish}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDimensions(item.grossLengthMm, item.grossWidthMm)}
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'qty',
      header: 'Qty',
      render: (line: POLineItem) => <span className="font-medium">{line.quantity}</span>,
    },
    {
      key: 'price',
      header: 'Unit price',
      render: (line: POLineItem) => formatCurrency(line.unitPrice),
    },
    {
      key: 'total',
      header: 'Line total',
      render: (line: POLineItem) => <span className="font-semibold">{formatCurrency(line.lineTotal)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (line: POLineItem) => {
        const item: any = line.itemSnapshot;
        if (line.status === 'confirmed') return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Confirmed</Badge>;
        if (line.status === 'declined') return <Badge variant="destructive">Declined</Badge>;
        if (item.status) return <SlabStatusBadge status={item.status} />;
        return <Badge variant="outline">{line.status}</Badge>;
      },
    },
  ];

  if (showActions && onLineAction) {
    columns.push({
      key: 'actions',
      header: '',
      render: (line: POLineItem) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Action</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLineAction(line.id, 'confirm')}>Confirm item</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLineAction(line.id, 'substitute')}>Substitute item</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onLineAction(line.id, 'decline')}>
                Decline item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    });
  }

  return <SbDataTable columns={columns} data={lineItems} keyExtractor={(line) => line.id} />;
}
