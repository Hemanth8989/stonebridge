import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ChevronLeft, 
  ShoppingCart, 
  ArrowRight, 
  Briefcase, 
  Building2, 
  Calendar,
  AlertCircle,
  Package,
  Trash2
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Input, 
  Label, 
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Separator,
  Alert,
  AlertTitle,
  AlertDescription,
  SbSpinner,
  cn 
} from '@sb/ui';
import { formatCurrency } from '@sb/utils';
import { useCartStore } from '../store/cartStore';
import { useJobs } from '../hooks/useJobs';
import { useCreatePO } from '../hooks/usePurchaseOrders';
import CartSummary from '../components/orders/CartSummary';

const poSchema = z.object({
  jobId: z.string().min(1, 'Please link this order to a job'),
  requestedDelivery: z.string().min(1, 'Requested delivery date is required'),
  fabricatorNote: z.string().optional(),
});

type POFormValues = z.infer<typeof poSchema>;

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { slabs, products, totalValue, totalItems, clear } = useCartStore();
  const { data: jobsData, isLoading: jobsLoading } = useJobs();
  const createPO = useCreatePO();

  const form = useForm<POFormValues>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      jobId: '',
      requestedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fabricatorNote: '',
    },
  });

  if (totalItems() === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
        <div className="h-24 w-24 rounded-full bg-muted/40 flex items-center justify-center shadow-inner">
          <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground italic">Add some slabs or products from the catalog to start a new PO.</p>
        </div>
        <Button className="font-black uppercase tracking-widest text-xs h-11 px-8 shadow-lg" onClick={() => navigate('/catalog')}>
          Browse Catalog
        </Button>
      </div>
    );
  }

  // Group items by supplier for multi-PO generation
  const supplierIds = new Set([
    ...slabs.map(s => s.slab.supplierId),
    ...products.map(p => p.product.supplierId)
  ]);

  const onSubmit = async (values: POFormValues) => {
    // In a real app, if multiple suppliers exist, we'd split into multiple POs or show a confirmation.
    // For now, we'll assume the back-end handles splitting or the UI restricts to one supplier.
    const supplierId = Array.from(supplierIds)[0];
    
    const dto = {
      supplierId,
      jobId: values.jobId,
      requestedDelivery: values.requestedDelivery,
      fabricatorNotes: values.fabricatorNote,
      lineItems: [
        ...slabs.map(s => ({
          variantId: s.slab.variantId,
          slabId: s.slab.id,
          quantity: 1,
          unitPrice: s.unitPrice,
          unitOfMeasure: (s.slab as any).unitOfMeasure || 'sqft',
        })),
        ...products.map(p => ({
          variantId: p.product.variantId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          unitOfMeasure: p.product.unitOfMeasure,
        })),
      ],
    };

    createPO.mutate(dto as any, {
      onSuccess: () => navigate('/orders'),
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-bold hover:bg-transparent p-0 group mb-2"
            onClick={() => navigate('/catalog')}
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Continue Shopping
          </Button>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Checkout</h1>
          <p className="text-sm font-medium text-muted-foreground italic">Review your order details and link to a job.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50" onClick={clear}>
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Clear Cart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Job Link */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Job Attribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Select Active Job *</Label>
                  <Select 
                    value={form.watch('jobId')} 
                    onValueChange={(v) => form.setValue('jobId', v)}
                  >
                    <SelectTrigger className={cn("h-12 shadow-sm font-bold", form.formState.errors.jobId && "border-red-500")}>
                      <SelectValue placeholder={jobsLoading ? "Loading jobs..." : "Choose a job to link this order to"} />
                    </SelectTrigger>
                    <SelectContent>
                      {jobsData?.data.filter(j => j.status !== 'closed' && j.status !== 'cancelled').map((job) => (
                        <SelectItem key={job.id} value={job.id} className="py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-black">{job.jobName}</span>
                            <span className="text-[10px] font-bold text-muted-foreground">#{job.jobNumber} · Customer: {job.customerName || 'N/A'}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.jobId && <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.jobId.message}</p>}
                </div>
                
                <Alert className="bg-primary/5 border-primary/20">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-xs text-primary font-bold italic">
                    Linking to a job allows StoneBridge to track your material budget automatically.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Logistics */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  Order Logistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requestedDelivery" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Requested Delivery Date *</Label>
                  <Input 
                    id="requestedDelivery" 
                    type="date" 
                    {...form.register('requestedDelivery')} 
                    className="h-12 shadow-sm font-bold"
                  />
                  <p className="text-[10px] text-muted-foreground font-medium italic">Suppliers will confirm if this date is achievable upon acknowledgment.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fabricatorNote" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Notes for Supplier</Label>
                  <Textarea 
                    id="fabricatorNote" 
                    {...form.register('fabricatorNote')} 
                    placeholder="E.g. Access instructions, specific bundle requirements, or special handling notes..."
                    className="min-h-[120px] resize-none shadow-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="pt-4">
              {supplierIds.size > 1 && (
                <Alert className="mb-6 bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-xs font-black uppercase tracking-widest text-amber-800">Multiple Suppliers Detected</AlertTitle>
                  <AlertDescription className="text-xs text-amber-700 font-bold">
                    This order contains items from {supplierIds.size} different suppliers. Separate purchase orders will be generated for each.
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-14 font-black uppercase tracking-widest text-xs shadow-2xl group"
                disabled={createPO.isPending}
              >
                {createPO.isPending ? <SbSpinner size="sm" className="mr-2" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                Confirm and Send {supplierIds.size > 1 ? 'Orders' : 'Order'}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <CartSummary />
          
          <div className="p-4 rounded-2xl bg-muted/30 border border-dashed border-border/60 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Protection</h4>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-primary shrink-0" />
              <p className="text-[10px] font-medium text-muted-foreground leading-tight">Your payment is held in escrow until you confirm receipt and condition of the materials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
