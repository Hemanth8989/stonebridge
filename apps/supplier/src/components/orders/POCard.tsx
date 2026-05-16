import React from 'react';
import { Card, POStatusBadge, SbAvatar, Button, Badge } from '@sb/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@sb/utils';
import type { POSummary } from '@sb/types';

interface POCardProps {
  po: POSummary;
  onClick: () => void;
}

export default function POCard({ po, onClick }: POCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger card click if we didn't click a button
    if ((e.target as HTMLElement).closest('button')) return;
    onClick();
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer p-4" onClick={handleClick}>
      <div className="flex justify-between items-start mb-3">
        <div className="font-mono font-semibold text-primary">{po.poNumber}</div>
        <POStatusBadge status={po.status} />
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <SbAvatar name={po.fabricatorName || 'F'} size="sm" />
        <div>
          <div className="font-medium text-sm leading-tight">{po.fabricatorName}</div>
          <div className="text-xs text-muted-foreground">Premium Fabricator</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <div className="text-muted-foreground text-xs">Items</div>
          <div className="font-medium">{po.totalLines}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Total</div>
          <div className="font-medium text-foreground">{formatCurrency(po.totalAmount)}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Requested</div>
          <div className="font-medium">{po.requestedDelivery ? formatDate(po.requestedDelivery) : '-'}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
        <div className="text-xs text-muted-foreground">
          {po.sentAt ? `Sent ${formatRelativeTime(po.sentAt)}` : 'Draft'}
        </div>
        
        <div className="flex space-x-2">
          {po.status === 'sent' && (
            <>
              <Button variant="outline" size="sm" className="h-7 text-xs">Counter</Button>
              <Button size="sm" className="h-7 text-xs">Acknowledge</Button>
            </>
          )}
          {po.status === 'countered' && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900">Awaiting response</Badge>}
          {po.status === 'confirmed' && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Confirmed</Badge>}
          {po.status === 'shipped' && <Button variant="outline" size="sm" className="h-7 text-xs">Mark received</Button>}
        </div>
      </div>
    </Card>
  );
}
