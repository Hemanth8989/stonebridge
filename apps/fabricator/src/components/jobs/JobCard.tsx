import React from 'react';
import { Briefcase, Calendar, Target } from 'lucide-react';
import { 
  Card, 
  Badge, 
  Progress,
  cn 
} from '@sb/ui';
import { formatCurrency, formatDate } from '@sb/utils';
import type { Job } from '@sb/types';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

const statusColorMap: Record<string, any> = {
  quoted: 'default',
  approved: 'info',
  templated: 'secondary',
  fabricating: 'warning',
  ready: 'success',
  installed: 'success',
  closed: 'default',
  cancelled: 'destructive',
};

export default function JobCard({ job, onClick }: JobCardProps) {
  const budgetPercent = job.materialBudget ? (job.totalOrdered / job.materialBudget) * 100 : 0;
  
  return (
    <Card 
      className="group overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer p-5"
      onClick={onClick}
    >
      <div className="flex flex-col h-full space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                #{job.jobNumber}
              </span>
              <Badge variant={statusColorMap[job.status] || 'default'} className="text-[10px] font-black uppercase tracking-widest h-5 px-1.5 border-none shadow-sm">
                {job.status}
              </Badge>
            </div>
            <h3 className="text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
              {job.jobName}
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground truncate italic">
              Customer: {job.customerName || 'N/A'}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 py-1 border-y border-border/40">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-0.5">Fabrication</p>
              <p className="text-[10px] font-black text-foreground truncate">{job.fabricationDate ? formatDate(job.fabricationDate) : 'TBD'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-0.5">Install</p>
              <p className="text-[10px] font-black text-foreground truncate">{job.installDate ? formatDate(job.installDate) : 'TBD'}</p>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-baseline px-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Material Budget</span>
            <span className={cn(
              "text-[10px] font-black",
              budgetPercent > 100 ? "text-red-600" : (budgetPercent > 80 ? "text-amber-600" : "text-green-600")
            )}>
              {Math.round(budgetPercent)}%
            </span>
          </div>
          <Progress 
            value={Math.min(100, budgetPercent)} 
            className={cn(
              "h-1.5 shadow-inner",
              budgetPercent > 100 ? "bg-red-100 [&>div]:bg-red-500" : (budgetPercent > 80 ? "bg-amber-100 [&>div]:bg-amber-500" : "bg-green-100 [&>div]:bg-green-500")
            )} 
          />
          <div className="flex justify-between items-center text-[10px] font-black tracking-tighter text-muted-foreground/60 px-0.5">
            <span>{formatCurrency(job.totalOrdered)} Ordered</span>
            <span>{formatCurrency(job.materialBudget || 0)} Total</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
