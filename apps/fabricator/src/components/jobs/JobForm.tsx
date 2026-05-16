import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Button, 
  Input, 
  Label, 
  Textarea, 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem,
  SbSpinner,
  cn 
} from '@sb/ui';
import { useCreateJob, useUpdateJob } from '../../hooks/useJobs';
import type { Job, JobStatus } from '@sb/types';

const jobSchema = z.object({
  jobNumber: z.string().min(1, 'Job number is required'),
  jobName: z.string().min(1, 'Job name is required'),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal('')),
  customerPhone: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  templateDate: z.string().optional(),
  fabricationDate: z.string().optional(),
  installDate: z.string().optional(),
  materialBudget: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  defaultValues?: Partial<Job>;
  onSuccess: (job: Job) => void;
  mode: 'create' | 'edit';
  className?: string;
}

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: 'quoted', label: 'Quoted' },
  { value: 'approved', label: 'Approved' },
  { value: 'templated', label: 'Templated' },
  { value: 'fabricating', label: 'Fabricating' },
  { value: 'ready', label: 'Ready' },
  { value: 'installed', label: 'Installed' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function JobForm({ defaultValues, onSuccess, mode, className }: JobFormProps) {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const isPending = createJob.isPending || updateJob.isPending;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobNumber: defaultValues?.jobNumber || '',
      jobName: defaultValues?.jobName || '',
      customerName: defaultValues?.customerName || '',
      customerEmail: defaultValues?.customerEmail || '',
      customerPhone: defaultValues?.customerPhone || '',
      status: defaultValues?.status || 'quoted',
      templateDate: defaultValues?.templateDate ? new Date(defaultValues.templateDate).toISOString().split('T')[0] : '',
      fabricationDate: defaultValues?.fabricationDate ? new Date(defaultValues.fabricationDate).toISOString().split('T')[0] : '',
      installDate: defaultValues?.installDate ? new Date(defaultValues.installDate).toISOString().split('T')[0] : '',
      materialBudget: defaultValues?.materialBudget || 0,
      notes: defaultValues?.notes || '',
    },
  });

  const onSubmit = async (values: JobFormValues) => {
    if (mode === 'create') {
      createJob.mutate(values as any, {
        onSuccess: (data) => onSuccess(data.data as any),
      });
    } else if (defaultValues?.id) {
      updateJob.mutate({ id: defaultValues.id, data: values as any }, {
        onSuccess: (data) => onSuccess(data.data as any),
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Info */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-4">Job Info</h3>
          <div className="space-y-2">
            <Label htmlFor="jobNumber" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Job Number *</Label>
            <Input 
              id="jobNumber" 
              {...form.register('jobNumber')} 
              placeholder="e.g. JB-2024-001"
              className={cn("h-11 shadow-sm font-mono", form.formState.errors.jobNumber && "border-red-500")}
            />
            {form.formState.errors.jobNumber && <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.jobNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Job Name *</Label>
            <Input 
              id="jobName" 
              {...form.register('jobName')} 
              placeholder="e.g. Smith Kitchen Remodel"
              className={cn("h-11 shadow-sm", form.formState.errors.jobName && "border-red-500")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Status</Label>
            <Select 
              value={form.watch('status')} 
              onValueChange={(v) => form.setValue('status', v)}
            >
              <SelectTrigger className="h-11 shadow-sm font-bold">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs font-bold">{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialBudget" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Material Budget ($)</Label>
            <Input 
              id="materialBudget" 
              type="number" 
              {...form.register('materialBudget')} 
              className="h-11 shadow-sm font-black tracking-tight"
            />
          </div>
        </div>

        {/* Dates & Customer */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-2 mb-4">Dates & Customer</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="templateDate" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Template Date</Label>
              <Input id="templateDate" type="date" {...form.register('templateDate')} className="h-10 text-xs font-bold" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fabricationDate" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Fabrication Date</Label>
              <Input id="fabricationDate" type="date" {...form.register('fabricationDate')} className="h-10 text-xs font-bold" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="installDate" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Install Date</Label>
            <Input id="installDate" type="date" {...form.register('installDate')} className="h-10 text-xs font-bold" />
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="customerName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Customer Name</Label>
            <Input id="customerName" {...form.register('customerName')} className="h-10 text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerPhone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Phone</Label>
              <Input id="customerPhone" {...form.register('customerPhone')} className="h-10 text-xs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Email</Label>
              <Input id="customerEmail" type="email" {...form.register('customerEmail')} className="h-10 text-xs" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Notes</Label>
        <Textarea id="notes" {...form.register('notes')} className="min-h-[100px] resize-none text-sm" />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
        <Button 
          type="submit" 
          className="h-11 px-8 font-black uppercase tracking-widest text-xs shadow-lg"
          disabled={isPending}
        >
          {isPending ? <SbSpinner size="sm" className="mr-2" /> : null}
          {mode === 'create' ? 'Create Job' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
