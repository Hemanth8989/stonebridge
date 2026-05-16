import React from 'react';
import { formatDateTime } from '@sb/utils';
import type { PurchaseOrder } from '@sb/types';
import { cn } from '@sb/ui';

export default function POTimeline({ po }: { po: PurchaseOrder }) {
  const steps = [
    { id: 'draft', label: 'Draft', key: 'createdAt' },
    { id: 'sent', label: 'Sent', key: 'sentAt' },
    { id: 'acknowledged', label: 'Acknowledged', key: 'ackedAt' },
    { id: 'confirmed', label: 'Confirmed', key: 'confirmedAt' },
    { id: 'shipped', label: 'Shipped', key: 'shippedAt' },
    { id: 'received', label: 'Received', key: 'receivedAt' },
    { id: 'closed', label: 'Closed', key: 'closedAt' },
  ];

  let currentIdx = -1;
  const events: any[] = [];
  
  if (po.status === 'cancelled') {
    events.push({ label: 'Cancelled', timestamp: po.updatedAt, isRed: true });
    return (
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-destructive shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] flex flex-col items-start md:group-odd:items-end p-2 rounded">
            <div className="text-sm font-semibold text-destructive">Cancelled</div>
            <div className="text-xs text-muted-foreground">{formatDateTime(po.updatedAt)}</div>
          </div>
        </div>
      </div>
    );
  }

  const reachedMap: Record<string, boolean> = {
    draft: true,
    sent: !!po.sentAt,
    acknowledged: !!po.ackedAt,
    confirmed: po.status === 'confirmed' || po.status === 'shipped' || po.status === 'received' || po.status === 'closed',
    shipped: po.status === 'shipped' || po.status === 'received' || po.status === 'closed',
    received: po.status === 'received' || po.status === 'closed',
    closed: po.status === 'closed',
  };

  if (po.status === 'partially_acked') reachedMap.acknowledged = true;
  if (po.status === 'countered') reachedMap.acknowledged = true;

  const currentStepId = po.status === 'partially_acked' || po.status === 'countered' ? 'acknowledged' : po.status;

  return (
    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-border">
      {po.status === 'disputed' && (
        <div className="relative flex items-start mb-6">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive shadow shrink-0 z-10 border-4 border-card"></div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-destructive">Disputed</div>
            <div className="text-xs text-muted-foreground">{formatDateTime(po.updatedAt)}</div>
          </div>
        </div>
      )}

      {steps.map((step, idx) => {
        const isReached = reachedMap[step.id];
        const isCurrent = step.id === currentStepId;
        const timestampStr = (po as any)[step.key] || (isCurrent ? po.updatedAt : null);

        return (
          <div key={step.id} className="relative flex items-start pb-6 last:pb-0">
            <div className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full shrink-0 z-10 border-4 border-card",
              isReached ? "bg-primary" : "bg-muted border-border border-2",
              isCurrent && "ring-4 ring-primary/20 bg-primary"
            )}></div>
            <div className="ml-4 flex flex-col min-w-0">
              <div className={cn("text-sm font-semibold", isReached ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
                {step.id === 'acknowledged' && po.status === 'partially_acked' && ' (Partial)'}
                {step.id === 'acknowledged' && po.status === 'countered' && ' (Countered)'}
              </div>
              {timestampStr && (
                <div className="text-xs text-muted-foreground mt-0.5">{formatDateTime(timestampStr)}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
