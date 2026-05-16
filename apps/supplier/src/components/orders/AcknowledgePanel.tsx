import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Separator, SbSpinner } from '@sb/ui';
import { formatCurrency } from '@sb/utils';
import type { PurchaseOrder, AcknowledgePODto } from '@sb/types';

interface AcknowledgePanelProps {
  po: PurchaseOrder;
  onAcknowledge: (data: AcknowledgePODto) => void;
  isPending: boolean;
}

export default function AcknowledgePanel({ po, onAcknowledge, isPending }: AcknowledgePanelProps) {
  const [lineStatuses, setLineStatuses] = useState<Record<string, 'confirmed' | 'declined' | 'substituted'>>(
    Object.fromEntries(po.lineItems.map(l => [l.id, 'confirmed']))
  );
  const [declineReasons, setDeclineReasons] = useState<Record<string, string>>({});

  const handleStatusChange = (id: string, status: 'confirmed' | 'declined' | 'substituted') => {
    setLineStatuses(prev => ({ ...prev, [id]: status }));
  };

  const handleAcknowledgeAll = () => {
    onAcknowledge({
      lineItems: po.lineItems.map(line => ({
        id: line.id,
        status: 'confirmed'
      }))
    });
  };

  const handleSubmit = () => {
    onAcknowledge({
      lineItems: po.lineItems.map(line => ({
        id: line.id,
        status: lineStatuses[line.id] as any,
        declineReason: lineStatuses[line.id] === 'declined' ? declineReasons[line.id] : undefined
      }))
    });
  };

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="text-lg">Acknowledge order</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">{po.lineItems.length}</span> line items · Total <span className="font-medium">{formatCurrency(po.totalAmount)}</span>
          </div>
          <Button onClick={handleAcknowledgeAll} disabled={isPending}>
            {isPending && <SbSpinner className="mr-2" size="sm" />}
            Acknowledge all lines
          </Button>
        </div>
        
        <Separator />

        <div className="p-4 space-y-4">
          <h4 className="font-medium text-sm mb-3">Per-line actions</h4>
          {po.lineItems.map(line => (
            <div key={line.id} className="p-3 border border-border rounded-lg bg-card">
              <div className="flex justify-between items-center mb-3">
                <div className="font-medium text-sm">{(line.itemSnapshot as any).materialName || (line.itemSnapshot as any).name || 'Item'}</div>
                <div className="text-sm font-semibold">{formatCurrency(line.lineTotal)}</div>
              </div>
              <div className="flex space-x-4 mb-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    className="text-primary focus:ring-primary h-4 w-4" 
                    checked={lineStatuses[line.id] === 'confirmed'}
                    onChange={() => handleStatusChange(line.id, 'confirmed')}
                  />
                  <span className="text-sm font-medium">Confirm</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    className="text-primary focus:ring-primary h-4 w-4" 
                    checked={lineStatuses[line.id] === 'substituted'}
                    onChange={() => handleStatusChange(line.id, 'substituted')}
                  />
                  <span className="text-sm font-medium">Substitute</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    className="text-primary focus:ring-primary h-4 w-4 text-destructive" 
                    checked={lineStatuses[line.id] === 'declined'}
                    onChange={() => handleStatusChange(line.id, 'declined')}
                  />
                  <span className="text-sm font-medium text-destructive">Decline</span>
                </label>
              </div>
              
              {lineStatuses[line.id] === 'declined' && (
                <div className="mt-2 pl-6">
                  <Input 
                    placeholder="Reason for declining..." 
                    value={declineReasons[line.id] || ''}
                    onChange={(e) => setDeclineReasons(prev => ({ ...prev, [line.id]: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>
              )}
            </div>
          ))}
          
          <div className="flex justify-end pt-2">
            <Button onClick={handleSubmit} disabled={isPending} variant="outline" className="border-primary text-primary hover:bg-primary/5">
              {isPending && <SbSpinner className="mr-2" size="sm" />}
              Submit mixed acknowledgment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
