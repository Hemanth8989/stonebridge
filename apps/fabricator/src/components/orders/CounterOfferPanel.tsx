import React from 'react';
import { AlertTriangle, Calendar, MessageSquare, TrendingDown, TrendingUp } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  Badge,
  Button,
  SbDataTable,
  SbSpinner,
  cn 
} from '@sb/ui';
import { formatCurrency, formatDate } from '@sb/utils';
import type { PurchaseOrder } from '@sb/types';

interface CounterOfferPanelProps {
  po: PurchaseOrder;
  onAccept: () => void;
  onDecline: () => void;
  isPending: boolean;
}

export default function CounterOfferPanel({ po, onAccept, onDecline, isPending }: CounterOfferPanelProps) {
  if (!po.counterOffer) return null;

  const originalTotal = po.totalAmount;
  const proposedTotal = originalTotal + (po.counterOffer.lineChanges?.reduce((sum, item) => sum + (item.proposedPrice - item.originalPrice), 0) || 0);
  const diff = proposedTotal - originalTotal;

  return (
    <Card className="border-l-4 border-l-orange-500 border-border/50 bg-orange-50/30 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-900 font-black tracking-tight">Supplier Counter Offer</CardTitle>
          </div>
          <Badge className="bg-orange-600 text-white font-black tracking-widest uppercase text-[10px]">Action Required</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Change */}
        {po.counterOffer.proposedDelivery && po.counterOffer.proposedDelivery !== po.requestedDelivery && (
          <div className="flex items-center gap-4 bg-white/60 p-3 rounded-lg border border-orange-200 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Proposed Delivery</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold line-through text-muted-foreground/60">{formatDate(po.requestedDelivery!)}</span>
                <span className="text-xs font-black text-orange-700">→ {formatDate(po.counterOffer.proposedDelivery)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Supplier Note */}
        {po.counterOffer.supplierNote && (
          <div className="flex gap-3 bg-white/60 p-4 rounded-lg border border-orange-200 italic shadow-sm relative overflow-hidden">
            <MessageSquare className="h-4 w-4 text-orange-400 mt-1 shrink-0" />
            <p className="text-sm text-orange-900 font-medium leading-relaxed">
              "{po.counterOffer.supplierNote}"
            </p>
            <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-orange-100/30 rounded-full blur-2xl" />
          </div>
        )}

        {/* Line Item Changes */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Proposed Pricing Changes</p>
          <div className="rounded-lg border border-orange-200 bg-white/80 overflow-hidden shadow-sm">
            <SbDataTable
              keyExtractor={(item: any) => item.lineItemId}
              data={po.counterOffer.lineChanges || []}
              columns={[
                {
                  key: 'original',
                  header: 'Original',
                  render: (row: any) => <span className="text-xs text-muted-foreground font-bold">{formatCurrency(row.originalPrice)}</span>,
                },
                {
                  key: 'proposed',
                  header: 'Proposed',
                  render: (row: any) => <span className="text-xs text-orange-700 font-black">{formatCurrency(row.proposedPrice)}</span>,
                },
                {
                  key: 'diff',
                  header: 'Diff',
                  align: 'right',
                  render: (row: any) => {
                    const priceDiff = row.proposedPrice - row.originalPrice;
                    return (
                      <div className={cn(
                        "flex items-center gap-1 text-[10px] font-black uppercase",
                        priceDiff > 0 ? "text-red-600" : (priceDiff < 0 ? "text-green-600" : "text-muted-foreground")
                      )}>
                        {priceDiff > 0 ? <TrendingUp className="h-3 w-3" /> : (priceDiff < 0 ? <TrendingDown className="h-3 w-3" /> : null)}
                        {priceDiff === 0 ? 'No change' : formatCurrency(Math.abs(priceDiff))}
                      </div>
                    );
                  }
                }
              ]}
            />
          </div>
        </div>

        {/* Total Impact */}
        <div className="flex justify-end pt-2">
          <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-orange-200 shadow-md">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Total</p>
              <p className="text-xs font-bold text-muted-foreground line-through">{formatCurrency(originalTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">New Proposed Total</p>
              <p className="text-2xl font-black tracking-tighter text-orange-700">{formatCurrency(proposedTotal)}</p>
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                diff > 0 ? "text-red-600" : "text-green-600"
              )}>
                {diff > 0 ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`} difference
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-orange-100/50 p-6 flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 font-black uppercase tracking-widest text-xs h-11 border-orange-300 text-orange-800 hover:bg-orange-200"
          onClick={onDecline}
          disabled={isPending}
        >
          Decline Counter
        </Button>
        <Button 
          className="flex-[2] font-black uppercase tracking-widest text-xs h-11 bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
          onClick={onAccept}
          disabled={isPending}
        >
          {isPending ? <SbSpinner size="sm" className="mr-2" /> : null}
          Accept Counter Offer
        </Button>
      </CardFooter>
    </Card>
  );
}
