import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '@sb/utils';
import {
  Button,
  SbPageHeader,
  SbSpinner,
  SbEmptyState,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  SbAvatar,
  Badge,
} from '@sb/ui';
import type { PurchaseOrder } from '@sb/types';
import {
  usePurchaseOrder,
  useAcknowledgePO,
  useCounterPO,
  useCancelPO,
  useMarkShipped,
} from '../hooks/usePurchaseOrders';
import POLineItemsTable from '../components/orders/POLineItemsTable';
import AcknowledgePanel from '../components/orders/AcknowledgePanel';
import CounterOfferForm from '../components/orders/CounterOfferForm';
import POTimeline from '../components/orders/POTimeline';

export default function PODetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: poData, isLoading, isError } = usePurchaseOrder(id ?? null);
  const po = poData?.data as PurchaseOrder & { fabricatorName?: string };
  const [showCounter, setShowCounter] = useState(false);

  const ackMutation = useAcknowledgePO();
  const counterMutation = useCounterPO();
  const cancelMutation = useCancelPO();
  const shipMutation = useMarkShipped();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <SbSpinner size="lg" />
      </div>
    );
  }

  if (isError || !po) {
    return <SbEmptyState title="PO Not Found" description="Could not load purchase order." />;
  }

  const renderActions = () => {
    if (po.status === 'sent') {
      return (
        <div className="flex space-x-2">
          <Button variant="destructive" onClick={() => cancelMutation.mutate(po.id)}>Decline</Button>
          <Button variant="outline" onClick={() => setShowCounter(true)}>Counter offer</Button>
          <Button onClick={() => setShowCounter(false)}>Acknowledge</Button>
        </div>
      );
    }
    if (po.status === 'confirmed') {
      return (
        <Button onClick={() => shipMutation.mutate({ id: po.id, data: { trackingNumber: 'TRK123' } })}>
          Mark as shipped
        </Button>
      );
    }
    if (po.status === 'shipped') {
      return <Button variant="outline" disabled>Awaiting receipt</Button>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-muted-foreground mb-4 cursor-pointer hover:text-foreground" onClick={() => navigate('/orders')}>
        &larr; Back to PO Inbox
      </div>

      <SbPageHeader
        title={<span className="font-mono">{po.poNumber}</span> as any}
        description={`${po.fabricatorName} · Sent ${formatDate(po.sentAt || '')}`}
        actions={renderActions()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <POLineItemsTable lineItems={po.lineItems} poStatus={po.status} />
            </CardContent>
          </Card>

          {po.status === 'sent' && !showCounter && (
            <AcknowledgePanel
              po={po}
              onAcknowledge={(data) => ackMutation.mutate({ id: po.id, data })}
              isPending={ackMutation.isPending}
            />
          )}

          {showCounter && (
            <CounterOfferForm
              po={po}
              onSubmit={(data) => counterMutation.mutate({ id: po.id, data }, { onSuccess: () => setShowCounter(false) })}
              onCancel={() => setShowCounter(false)}
              isPending={counterMutation.isPending}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(po.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(po.totalAmount)}</span>
              </div>
              <div className="pt-4 space-y-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Requested Delivery:</span>{' '}
                  {po.requestedDelivery ? formatDate(po.requestedDelivery) : 'Not set'}
                </div>
                {po.confirmedDelivery && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Confirmed Delivery:</span>{' '}
                    <span className="font-medium text-green-600 dark:text-green-400">{formatDate(po.confirmedDelivery)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <POTimeline po={po} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fabricator</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-3">
              <SbAvatar name={po.fabricatorName || 'F'} />
              <div>
                <div className="font-medium">{po.fabricatorName}</div>
                <div className="text-xs text-muted-foreground">Premium Connection</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
