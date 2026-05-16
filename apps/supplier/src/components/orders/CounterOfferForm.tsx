import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Textarea, Button, SbSpinner } from '@sb/ui';
import { formatCurrency } from '@sb/utils';
import type { PurchaseOrder, CounterPODto } from '@sb/types';

const counterSchema = z.object({
  proposedDeliveryDate: z.string().optional(),
  supplierNote: z.string().optional(),
  prices: z.record(z.string(), z.coerce.number().min(0))
});

type FormData = z.infer<typeof counterSchema>;

interface CounterOfferFormProps {
  po: PurchaseOrder;
  onSubmit: (data: CounterPODto) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function CounterOfferForm({ po, onSubmit, onCancel, isPending }: CounterOfferFormProps) {
  const defaultPrices: Record<string, number> = {};
  po.lineItems.forEach(line => {
    defaultPrices[line.id] = line.unitPrice;
  });

  const form = useForm<FormData>({
    resolver: zodResolver(counterSchema),
    defaultValues: {
      proposedDeliveryDate: '',
      supplierNote: '',
      prices: defaultPrices
    }
  });

  const handleFormSubmit = (data: FormData) => {
    const lineChanges: { lineItemId: string; originalPrice: number; proposedPrice: number; reason: string }[] = [];
    
    Object.entries(data.prices).forEach(([id, price]) => {
      const originalLine = po.lineItems.find(l => l.id === id);
      if (originalLine && originalLine.unitPrice !== price) {
        lineChanges.push({ 
          lineItemId: id, 
          originalPrice: originalLine.unitPrice, 
          proposedPrice: price, 
          reason: 'Price update' 
        });
      }
    });

    onSubmit({
      counterOffer: {
        proposedDelivery: data.proposedDeliveryDate || null,
        supplierNote: data.supplierNote || null,
        lineChanges: lineChanges
      }
    });
  };

  return (
    <Card className="border-amber-500/30 shadow-sm">
      <CardHeader className="bg-amber-50/50 dark:bg-amber-950/20 pb-4">
        <CardTitle className="text-lg">Counter offer</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Line Item Pricing</h4>
              {po.lineItems.map(line => (
                <div key={line.id} className="flex items-center justify-between p-3 border border-border rounded-md">
                  <div>
                    <div className="font-medium text-sm">{(line.itemSnapshot as any).materialName || (line.itemSnapshot as any).name || 'Item'}</div>
                    <div className="text-xs text-muted-foreground">Original: {formatCurrency(line.unitPrice)}/ea</div>
                  </div>
                  <div className="w-32">
                    <FormField control={form.control} name={`prices.${line.id}`} render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                            <Input type="number" step="0.01" className="pl-6 h-8 text-sm" {...field} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                </div>
              ))}
            </div>

            <FormField control={form.control} name="proposedDeliveryDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Delivery Date</FormLabel>
                <FormControl><Input type="date" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="supplierNote" render={({ field }) => (
              <FormItem>
                <FormLabel>Message to fabricator</FormLabel>
                <FormControl><Textarea placeholder="Explain your counter offer..." className="resize-none" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="bg-amber-600 hover:bg-amber-700 text-white">
                {isPending && <SbSpinner className="mr-2 text-white" size="sm" />}
                Send counter offer
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
