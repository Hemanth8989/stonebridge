import React from 'react';
import { 
  SbDataTable, 
  Badge,
  cn 
} from '@sb/ui';
import { formatCurrency } from '@sb/utils';
import type { POLineItem, POStatus } from '@sb/types';

interface POLineItemsTableProps {
  lineItems: POLineItem[];
  poStatus: POStatus;
}

const statusColorMap: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground border-transparent',
  confirmed: 'bg-green-500/10 text-green-600 border-green-500/20',
  declined: 'bg-red-500/10 text-red-600 border-red-500/20',
  substituted: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  received: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

const conditionColorMap: Record<string, string> = {
  perfect: 'text-green-600 bg-green-50',
  damaged: 'text-red-600 bg-red-50',
  minor_scratch: 'text-amber-600 bg-amber-50',
};

export default function POLineItemsTable({ lineItems }: POLineItemsTableProps) {
  const subtotal = lineItems
    .filter(item => item.status !== 'declined')
    .reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
      <SbDataTable
        keyExtractor={(item) => item.id}
        data={lineItems}
        columns={[
          {
            key: 'photo',
            header: 'Photo',
            width: '70px',
            render: (row) => (
              <div className="h-12 w-12 overflow-hidden rounded-md bg-muted border border-border/40">
                {row.itemSnapshot?.primaryPhotoUrl && (
                  <img src={row.itemSnapshot.primaryPhotoUrl} className="h-full w-full object-cover" alt="" />
                )}
              </div>
            ),
          },
          {
            key: 'item',
            header: 'Item',
            render: (row) => (
              <div>
                <p className="font-bold text-sm text-foreground">
                  {(row.itemSnapshot as any)?.materialName || (row.itemSnapshot as any)?.name || 'Unknown Item'}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  {(row.itemSnapshot as any)?.colorFamily} · {(row.itemSnapshot as any)?.finish}
                </p>
              </div>
            ),
          },
          {
            key: 'details',
            header: 'Details',
            render: (row) => (
              <p className="text-xs text-muted-foreground/80 font-medium">
                {(row.itemSnapshot as any)?.grossLengthMm && `${(row.itemSnapshot as any).grossLengthMm}mm x ${(row.itemSnapshot as any).grossWidthMm}mm`}
                {(row.itemSnapshot as any)?.thicknessCm && ` · ${(row.itemSnapshot as any).thicknessCm}cm`}
              </p>
            ),
          },
          {
            key: 'qty',
            header: 'Qty',
            width: '100px',
            render: (row) => (
              <p className="text-xs font-bold">
                {row.quantity} <span className="text-[10px] text-muted-foreground uppercase">{row.unitOfMeasure}</span>
              </p>
            ),
          },
          {
            key: 'price',
            header: 'Unit Price',
            render: (row) => (
              <p className="text-xs font-bold text-foreground/80">{formatCurrency(row.unitPrice)}</p>
            ),
          },
          {
            key: 'total',
            header: 'Line Total',
            render: (row) => (
              <p className={cn(
                "text-sm font-black tracking-tight",
                row.status === 'declined' ? "text-muted-foreground/40 line-through" : "text-primary"
              )}>
                {formatCurrency(row.unitPrice * row.quantity)}
              </p>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <Badge 
                variant="outline" 
                className={cn("text-[10px] font-black uppercase tracking-widest h-5 px-1.5", statusColorMap[row.status])}
              >
                {row.status}
              </Badge>
            ),
          },
          {
            key: 'condition',
            header: 'Condition',
            render: (row) => row.receivedCondition ? (
              <Badge 
                variant="outline" 
                className={cn("text-[10px] font-black uppercase tracking-widest h-5 px-1.5", conditionColorMap[row.receivedCondition])}
              >
                {row.receivedCondition.replace('_', ' ')}
              </Badge>
            ) : <span className="text-muted-foreground/30 text-[10px] font-black">—</span>,
          },
        ]}
      />
      <div className="flex justify-end p-4 bg-accent/10 border-t border-border/50">
        <div className="flex items-baseline gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Subtotal</span>
          <span className="text-xl font-black tracking-tighter text-foreground">{formatCurrency(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
