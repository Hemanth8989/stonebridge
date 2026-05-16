import React from 'react';
import { AlertCircle, Target, ShoppingBag, Package } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Progress,
  Alert,
  AlertTitle,
  AlertDescription,
  cn 
} from '@sb/ui';
import { formatCurrency } from '@sb/utils';

interface JobMaterialProgressProps {
  materialBudget: number | null;
  totalOrdered: number;
  totalReceived: number;
  currency?: string;
}

export default function JobMaterialProgress({ materialBudget, totalOrdered, totalReceived }: JobMaterialProgressProps) {
  const budgetValue = materialBudget || 0;
  const orderedPercent = budgetValue > 0 ? (totalOrdered / budgetValue) * 100 : 0;
  const receivedPercent = budgetValue > 0 ? (totalReceived / budgetValue) * 100 : 0;
  
  const isOverBudget = budgetValue > 0 && totalOrdered > budgetValue;

  return (
    <Card className="border-border/50 bg-card overflow-hidden shadow-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
          <Target className="h-4 w-4 text-primary" />
          Material Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* Metric Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Total Budget</p>
            <p className="text-xl font-black tracking-tighter text-foreground">{formatCurrency(budgetValue)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Total Ordered</p>
            <p className={cn(
              "text-xl font-black tracking-tighter",
              isOverBudget ? "text-red-600" : "text-primary"
            )}>
              {formatCurrency(totalOrdered)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Total Received</p>
            <p className="text-xl font-black tracking-tighter text-emerald-600">{formatCurrency(totalReceived)}</p>
          </div>
        </div>

        {/* Multi-Bar Progress */}
        <div className="space-y-3">
          <div className="relative h-4 w-full bg-muted rounded-full overflow-hidden shadow-inner">
            {/* Ordered Bar */}
            <div 
              className={cn(
                "absolute top-0 left-0 h-full transition-all duration-1000 ease-out",
                isOverBudget ? "bg-red-500" : "bg-primary"
              )}
              style={{ width: `${Math.min(100, orderedPercent)}%` }}
            />
            {/* Received Bar Overlay */}
            <div 
              className="absolute top-0 left-0 h-full bg-emerald-500 opacity-40 transition-all duration-1000 ease-out delay-300"
              style={{ width: `${Math.min(100, receivedPercent)}%` }}
            />
          </div>

          {/* Legend */}
          <div className="flex gap-4 px-1">
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", isOverBudget ? "bg-red-500" : "bg-primary")} />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Ordered ({Math.round(orderedPercent)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Received ({Math.round(receivedPercent)}%)</span>
            </div>
          </div>
        </div>

        {/* Warning Alert */}
        {isOverBudget && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-xs font-black uppercase tracking-widest text-red-800">Budget Exceeded</AlertTitle>
            <AlertDescription className="text-xs text-red-700 font-bold">
              Material cost is over budget by <span className="font-black underline">{formatCurrency(totalOrdered - budgetValue)}</span>.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
