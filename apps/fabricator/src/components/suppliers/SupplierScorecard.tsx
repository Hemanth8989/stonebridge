import React from 'react';
import { CheckCircle2, Clock, MessageSquare, Package } from 'lucide-react';
import { SbStatCard, cn } from '@sb/ui';

interface SupplierScorecardProps {
  fulfillmentRate: number | null;
  avgLeadDays: number | null;
  avgResponseHrs: number | null;
  totalSlabsSold: number;
  className?: string;
}

export default function SupplierScorecard({ 
  fulfillmentRate, 
  avgLeadDays, 
  avgResponseHrs, 
  totalSlabsSold,
  className 
}: SupplierScorecardProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <SbStatCard
        title="Fulfillment"
        value={fulfillmentRate ? `${fulfillmentRate}%` : '—'}
        icon={<CheckCircle2 className={cn(
          "h-4 w-4",
          fulfillmentRate && fulfillmentRate >= 90 ? "text-green-500" : (fulfillmentRate && fulfillmentRate >= 70 ? "text-amber-500" : "text-red-500")
        )} />}
        className="shadow-sm border-border/40"
      />
      <SbStatCard
        title="Avg Lead"
        value={avgLeadDays ? `${avgLeadDays}d` : '—'}
        icon={<Clock className="h-4 w-4 text-primary" />}
        className="shadow-sm border-border/40"
      />
      <SbStatCard
        title="Response"
        value={avgResponseHrs ? `${avgResponseHrs}h` : '—'}
        icon={<MessageSquare className="h-4 w-4 text-amber-500" />}
        className="shadow-sm border-border/40"
      />
      <SbStatCard
        title="Slabs Sold"
        value={totalSlabsSold}
        icon={<Package className="h-4 w-4 text-purple-500" />}
        className="shadow-sm border-border/40"
      />
    </div>
  );
}
