import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@sb/ui';
import { formatDate } from '@sb/utils';
import type { PurchaseOrder } from '@sb/types';

interface POStatusTimelineProps {
  po: PurchaseOrder;
}

const steps = [
  { status: 'draft', label: 'Draft' },
  { status: 'sent', label: 'Sent' },
  { status: 'acknowledged', label: 'Acknowledged' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'received', label: 'Received' },
  { status: 'closed', label: 'Closed' },
];

export default function POStatusTimeline({ po }: POStatusTimelineProps) {
  const currentStepIndex = steps.findIndex(step => step.status === po.status);
  const isCancelled = po.status === 'cancelled';
  const isDisputed = po.status === 'disputed';

  return (
    <div className="w-full py-8 px-4 overflow-x-auto custom-scrollbar">
      <div className="flex min-w-[800px] items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-10" />
        
        {steps.map((step, index) => {
          const isCompleted = !isCancelled && index < currentStepIndex;
          const isCurrent = !isCancelled && index === currentStepIndex;
          const isFuture = !isCancelled && index > currentStepIndex;
          
          let timestamp = '';
          if (step.status === 'sent') timestamp = po.sentAt || '';
          if (step.status === 'acknowledged') timestamp = po.ackedAt || '';
          if (step.status === 'shipped') timestamp = po.shippedAt || '';
          if (step.status === 'received') timestamp = po.receivedAt || '';
          if (step.status === 'closed') timestamp = po.updatedAt || '';

          return (
            <div key={step.status} className="flex flex-col items-center flex-1 relative">
              {/* Connector Line (Progressive) */}
              {index > 0 && (
                <div 
                  className={cn(
                    "absolute top-5 -left-1/2 w-full h-0.5 -z-10 transition-all duration-500",
                    isCompleted || isCurrent ? "bg-green-500" : "bg-border"
                  )} 
                />
              )}

              {/* Indicator Circle */}
              <div 
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm",
                  isCompleted && "bg-green-500 border-green-500 text-white",
                  isCurrent && "bg-background border-primary text-primary scale-110 ring-4 ring-primary/20",
                  isFuture && "bg-background border-border text-muted-foreground",
                  isCancelled && index > 1 && "bg-muted border-border text-muted-foreground opacity-50"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 font-black" />
                ) : (
                  <span className="text-[10px] font-black">{index + 1}</span>
                )}
              </div>

              {/* Label & Date */}
              <div className="mt-4 text-center">
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                {timestamp && (
                  <p className="text-[10px] font-bold text-muted-foreground/60 mt-0.5">
                    {formatDate(timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isDisputed && (
        <div className="mt-8 flex justify-center">
          <div className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg animate-bounce">
            Order Under Dispute
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mt-8 flex justify-center">
          <div className="bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-border">
            Order Cancelled
          </div>
        </div>
      )}
    </div>
  );
}
