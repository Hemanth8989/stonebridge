import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Printer, 
  Download, 
  MessageSquare, 
  AlertCircle,
  Truck,
  CheckCircle2,
  Package,
  Building2,
  Briefcase,
  AlertTriangle
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Badge, 
  SbSpinner, 
  POStatusBadge,
  SbAvatar,
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Textarea,
  Label,
  cn 
} from '@sb/ui';
import { formatCurrency, formatDate, formatRelativeTime } from '@sb/utils';
import { 
  usePurchaseOrder, 
  useAcceptCounter, 
  useCancelPO, 
  useConfirmReceived, 
  useRaiseDispute 
} from '../hooks/usePurchaseOrders';
import POStatusTimeline from '../components/orders/POStatusTimeline';
import POLineItemsTable from '../components/orders/POLineItemsTable';
import CounterOfferPanel from '../components/orders/CounterOfferPanel';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: poResponse, isLoading } = usePurchaseOrder(id!);
  const po = poResponse?.data;
  
  const acceptCounter = useAcceptCounter();
  const cancelPO = useCancelPO();
  const confirmReceived = useConfirmReceived();
  const raiseDispute = useRaiseDispute();

  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeNote, setDisputeNote] = useState('');

  if (isLoading) return <div className="flex h-screen items-center justify-center"><SbSpinner size="lg" /></div>;
  if (!po) return <div className="p-12 text-center">Order not found</div>;

  const handleAcceptCounter = () => {
    acceptCounter.mutate(po.id);
  };

  const handleConfirmReceived = () => {
    confirmReceived.mutate(po.id);
  };

  const handleRaiseDispute = () => {
    raiseDispute.mutate({ id: po.id, data: { note: disputeNote } }, {
      onSuccess: () => {
        setDisputeOpen(false);
        setDisputeNote('');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-bold hover:bg-transparent p-0 group mb-2"
            onClick={() => navigate('/orders')}
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">PO #{po.poNumber}</h1>
            <POStatusBadge status={po.status} />
          </div>
          <p className="text-xs font-bold text-muted-foreground italic">Placed on {formatDate(po.createdAt)} · Linked to Job ID: <span className="text-primary hover:underline cursor-pointer font-black" onClick={() => navigate(`/jobs/${po.jobId}`)}>{po.jobId || 'N/A'}</span></p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 px-4 font-black uppercase tracking-widest text-[10px] border-border/50 bg-card/50">
            <Printer className="mr-2 h-3.5 w-3.5" />
            Print PO
          </Button>
          <Button variant="outline" size="sm" className="h-10 px-4 font-black uppercase tracking-widest text-[10px] border-border/50 bg-card/50">
            <Download className="mr-2 h-3.5 w-3.5" />
            Invoice
          </Button>
          <Button size="sm" className="h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg">
            <MessageSquare className="mr-2 h-3.5 w-3.5" />
            Message Supplier
          </Button>
        </div>
      </div>

      {/* Status Timeline */}
      <Card className="border-border/50 bg-card/50 shadow-sm overflow-hidden">
        <POStatusTimeline po={po} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Main Details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Counter Offer Section */}
          {po.status === 'countered' && (
            <CounterOfferPanel 
              po={po} 
              onAccept={handleAcceptCounter} 
              onDecline={() => cancelPO.mutate(po.id)}
              isPending={acceptCounter.isPending || cancelPO.isPending}
            />
          )}

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Line Items
              </h2>
              <Badge variant="outline" className="text-[10px] font-black">{po.lineItems.length} items</Badge>
            </div>
            <POLineItemsTable lineItems={po.lineItems} poStatus={po.status} />
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Your Notes
              </h3>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 italic text-sm font-medium text-foreground/80 min-h-[100px]">
                {po.fabricatorNotes || "No notes provided for this order."}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />
                Supplier Response
              </h3>
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 italic text-sm font-medium text-primary/80 min-h-[100px]">
                {po.supplierNotes || "Waiting for supplier response..."}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Order Summary Actions */}
          {po.status === 'shipped' && (
            <Card className="border-primary/30 bg-primary/5 shadow-xl animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Truck className="h-6 w-6" />
                  <p className="text-sm font-black uppercase tracking-tight">Order is Shipped!</p>
                </div>
                <p className="text-xs font-bold text-primary/70 leading-relaxed">
                  The supplier has confirmed this order is on its way. Please confirm receipt once it arrives at your shop.
                </p>
                <Button 
                  className="w-full h-12 font-black uppercase tracking-widest text-xs shadow-lg"
                  onClick={handleConfirmReceived}
                  disabled={confirmReceived.isPending}
                >
                  {confirmReceived.isPending ? 'Confirming...' : 'Confirm Received'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Order Stakeholders */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order Parties</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Supplier</p>
                <div className="flex items-center gap-3">
                  <SbAvatar name="Supplier" size="md" className="shadow-md" />
                  <div>
                    <p className="text-xs font-black text-foreground">Stone Supplier</p>
                    <p className="text-[10px] font-bold text-muted-foreground">ID: {po.supplierId.slice(-8)}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/40" />

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Linked Job</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground">Linked Job</p>
                    <p className="text-[10px] font-bold text-muted-foreground">ID: {po.jobId?.slice(-8) || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="border-border/50 shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Financials</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(po.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="text-foreground">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">TBD</span>
                </div>
                <Separator className="my-2 bg-border/40" />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Total</span>
                  <span className="text-2xl font-black tracking-tighter text-primary">{formatCurrency(po.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone / Disputes */}
          {po.status === 'received' && (
            <Button 
              variant="outline" 
              className="w-full h-10 border-red-200 text-red-600 hover:bg-red-50 font-black uppercase tracking-widest text-[10px]"
              onClick={() => setDisputeOpen(true)}
            >
              <AlertTriangle className="mr-2 h-3.5 w-3.5" />
              Report Issue / Dispute
            </Button>
          )}
        </div>
      </div>

      {/* Dispute Dialog */}
      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight text-red-600">Raise Order Dispute</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="disputeNote" className="text-xs font-bold uppercase tracking-widest">Description of Issue</Label>
              <Textarea 
                id="disputeNote" 
                placeholder="Please describe exactly what is wrong with the materials received..."
                className="min-h-[150px] resize-none"
                value={disputeNote}
                onChange={(e) => setDisputeNote(e.target.value)}
              />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground leading-relaxed italic">
              Once a dispute is raised, payment to the supplier is frozen and a StoneBridge agent will review the case within 24 hours.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDisputeOpen(false)}>Cancel</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white font-black" 
              onClick={handleRaiseDispute}
              disabled={!disputeNote || raiseDispute.isPending}
            >
              {raiseDispute.isPending ? 'Submitting...' : 'Confirm Dispute'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
