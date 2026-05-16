import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Check, 
  Clock, 
  Truck, 
  AlertTriangle, 
  AlertCircle 
} from 'lucide-react';
import { 
  Card, 
  Badge, 
  SbAvatar, 
  POStatusBadge,
  Button,
  cn 
} from '@sb/ui';
import { formatCurrency, formatRelativeTime, formatDate } from '@sb/utils';
import type { POSummary } from '@sb/types';
import { useConfirmReceived } from '../../hooks/usePurchaseOrders';

interface POCardProps {
  po: POSummary;
}

export default function POCard({ po }: POCardProps) {
  const navigate = useNavigate();
  const confirmReceived = useConfirmReceived();

  const handleCardClick = () => {
    navigate(`/orders/${po.id}`);
  };

  const handleConfirmReceived = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmReceived.mutate(po.id);
  };

  return (
    <Card 
      className="group overflow-hidden border-border/50 bg-card hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-stretch">
        {/* Status Line Indicator */}
        <div className={cn(
          "w-1.5 transition-all duration-300",
          po.status === 'sent' && "bg-amber-400",
          po.status === 'acknowledged' && "bg-blue-400",
          po.status === 'confirmed' && "bg-emerald-400",
          po.status === 'shipped' && "bg-primary",
          po.status === 'received' && "bg-green-500",
          po.status === 'countered' && "bg-orange-500",
          po.status === 'disputed' && "bg-red-500",
          (po.status === 'cancelled' || po.status === 'closed') && "bg-muted"
        )} />

        <div className="flex-1 p-5">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold tracking-tight text-foreground/80">
                #{po.poNumber}
              </span>
              <POStatusBadge status={po.status} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              {formatRelativeTime(po.createdAt)}
            </span>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <SbAvatar name={po.supplierName} size="sm" className="shadow-sm" />
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-foreground">{po.supplierName}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Stone Supplier</p>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold text-foreground">
                {po.totalLines} {po.totalLines === 1 ? 'item' : 'items'}
              </p>
              <p className="text-lg font-black tracking-tight text-primary">
                {formatCurrency(po.totalAmount)}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 mb-0.5">
                Delivery
              </p>
              <p className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                {po.confirmedDelivery ? formatDate(po.confirmedDelivery) : (po.requestedDelivery ? formatDate(po.requestedDelivery) : 'TBD')}
              </p>
            </div>
          </div>

          {/* Context-specific Footer Messages */}
          <div className="mt-5 pt-4 border-t border-border/40">
            {po.status === 'sent' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold italic tracking-tight">Awaiting supplier response...</span>
                </div>
                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest">View details</Button>
              </div>
            )}

            {po.status === 'countered' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-orange-600 animate-pulse">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold italic tracking-tight underline underline-offset-4">Supplier made a counter offer</span>
                </div>
                <Button variant="default" size="sm" className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest bg-orange-600 hover:bg-orange-700">Review Counter</Button>
              </div>
            )}

            {po.status === 'shipped' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Truck className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold italic tracking-tight">On its way to your shop!</span>
                </div>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-8 px-4 text-[10px] font-bold uppercase tracking-widest"
                  onClick={handleConfirmReceived}
                  disabled={confirmReceived.isPending}
                >
                  {confirmReceived.isPending ? 'Processing...' : 'Confirm Received'}
                </Button>
              </div>
            )}

            {(po.status === 'received' || po.status === 'closed') && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-3.5 w-3.5" />
                <span className="text-xs font-bold italic tracking-tight">Order completed on {formatDate(po.receivedAt || po.updatedAt)}</span>
              </div>
            )}

            {po.status === 'disputed' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-xs font-bold italic tracking-tight">Dispute under investigation</span>
              </div>
            )}
            
            {po.status === 'acknowledged' && (
              <div className="flex items-center gap-2 text-blue-600">
                <Check className="h-3.5 w-3.5" />
                <span className="text-xs font-bold italic tracking-tight">Order acknowledged by supplier</span>
              </div>
            )}
            
            {po.status === 'confirmed' && (
              <div className="flex items-center gap-2 text-emerald-600">
                <Check className="h-3.5 w-3.5" />
                <span className="text-xs font-bold italic tracking-tight">Order confirmed and ready for fulfillment</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
