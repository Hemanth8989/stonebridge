import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Edit3, 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  Calendar,
  Package,
  TrendingUp,
  FileText,
  User,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Badge, 
  SbSpinner, 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
  cn 
} from '@sb/ui';
import { formatCurrency, formatDate } from '@sb/utils';
import { useJob, useJobPOs } from '../hooks/useJobs';
import JobForm from '../components/jobs/JobForm';
import JobMaterialProgress from '../components/jobs/JobMaterialProgress';
import POCard from '../components/orders/POCard';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const { data: jobResponse, isLoading } = useJob(id!);
  const job = jobResponse?.data;
  const { data: posData, isLoading: posLoading } = useJobPOs(id!);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><SbSpinner size="lg" /></div>;
  if (!job) return <div className="p-12 text-center">Job not found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-bold hover:bg-transparent p-0 group mb-2"
            onClick={() => navigate('/jobs')}
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Jobs
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">{job.jobName}</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-black uppercase tracking-widest h-7 px-4 shadow-sm">
              {job.status}
            </Badge>
          </div>
          <p className="text-xs font-bold text-muted-foreground italic">Job Number: <span className="font-mono text-foreground font-black">#{job.jobNumber}</span></p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 px-4 font-black uppercase tracking-widest text-[10px] border-border/50 bg-card/50"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit3 className="mr-2 h-3.5 w-3.5" />
            Edit Job
          </Button>
          <Button 
            size="sm" 
            className="h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg group"
            onClick={() => navigate('/catalog')}
          >
            <ShoppingBag className="mr-2 h-3.5 w-3.5" />
            Order Materials
            <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Main Tracking */}
        <div className="lg:col-span-8 space-y-10">
          {/* Material Tracking Component */}
          <JobMaterialProgress 
            materialBudget={job.materialBudget} 
            totalOrdered={job.totalOrdered} 
            totalReceived={job.totalReceived} 
          />

          {/* Connected Purchase Orders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Purchase Orders for this Job
              </h2>
              <Badge variant="outline" className="text-[10px] font-black">{posData?.data.length || 0} orders</Badge>
            </div>
            
            {posLoading ? (
              <div className="flex py-12 justify-center"><SbSpinner size="sm" /></div>
            ) : posData?.data.length === 0 ? (
              <div className="p-12 rounded-3xl border border-dashed border-border/50 bg-card/30 text-center">
                <p className="text-xs font-bold text-muted-foreground italic">No purchase orders found for this job yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posData?.data.map((po) => (
                  <POCard key={po.id} po={po as any} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Customer Info */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-1">
                <p className="text-lg font-black tracking-tight text-foreground">{job.customerName || 'N/A'}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {job.customerEmail || 'No email provided'}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {job.customerPhone || 'No phone provided'}
                </div>
              </div>
              <Separator className="bg-border/40" />
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary h-8">
                <MessageSquare className="mr-2 h-3.5 w-3.5" />
                Message Customer
              </Button>
            </CardContent>
          </Card>

          {/* Job Timeline / Schedule */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-black text-xs">01</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Template Date</p>
                  <p className="text-sm font-black text-foreground">{job.templateDate ? formatDate(job.templateDate) : 'TBD'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground font-black text-xs">02</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Fabrication Start</p>
                  <p className="text-sm font-black text-foreground">{job.fabricationDate ? formatDate(job.fabricationDate) : 'TBD'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-inner">03</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 leading-none mb-1">Installation</p>
                  <p className="text-sm font-black text-primary">{job.installDate ? formatDate(job.installDate) : 'TBD'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Notes */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              Job Notes
            </h3>
            <div className="p-5 rounded-2xl bg-card border border-border/50 text-sm font-medium text-foreground/80 leading-relaxed shadow-sm">
              {job.notes || "No additional notes for this job."}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Job Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Edit Job Details</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <JobForm 
              mode="edit" 
              defaultValues={job}
              onSuccess={() => {
                setIsEditOpen(false);
                // React query handles refresh
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
