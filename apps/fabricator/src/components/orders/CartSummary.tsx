import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button,
  cn 
} from '@sb/ui';
import { formatCurrency, formatDimensions } from '@sb/utils';
import { useCartStore } from '../../store/cartStore';

interface CartSummaryProps {
  className?: string;
}

export default function CartSummary({ className }: CartSummaryProps) {
  const { 
    slabs, 
    products, 
    removeSlab, 
    removeProduct, 
    totalValue,
    totalItems 
  } = useCartStore();

  if (totalItems() === 0) return null;

  return (
    <Card className={cn("border-border/50 bg-card/50 shadow-sm overflow-hidden", className)}>
      <CardHeader className="pb-4 bg-muted/30 border-b border-border/40">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <CardTitle className="text-xs font-black uppercase tracking-widest">Order Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40 max-h-[400px] overflow-y-auto custom-scrollbar">
          {slabs.map((item) => (
            <div key={item.slab.id} className="p-4 flex gap-4 group hover:bg-muted/30 transition-colors">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted border border-border/40 shadow-sm">
                {item.slab.primaryPhotoUrl && (
                  <img src={item.slab.primaryPhotoUrl} className="h-full w-full object-cover" alt="" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-foreground">{item.slab.materialName}</p>
                <p className="text-[10px] text-muted-foreground font-medium truncate mb-1">
                  {formatDimensions(item.slab.grossLengthMm, item.slab.grossWidthMm)}
                </p>
                <p className="text-xs font-black text-primary">{formatCurrency(item.unitPrice)}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all rounded-full opacity-0 group-hover:opacity-100"
                onClick={() => removeSlab(item.slab.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}

          {products.map((item) => (
            <div key={item.product.variantId} className="p-4 flex gap-4 group hover:bg-muted/30 transition-colors">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted border border-border/40 shadow-sm flex items-center justify-center">
                {item.product.primaryPhotoUrl ? (
                  <img src={item.product.primaryPhotoUrl} className="h-full w-full object-cover" alt="" />
                ) : (
                  <ShoppingBag className="h-5 w-5 text-muted-foreground/20" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-foreground">{item.product.productName}</p>
                <p className="text-[10px] text-muted-foreground font-medium mb-1">
                  {item.quantity} {item.product.unitOfMeasure}{item.quantity > 1 ? 's' : ''}
                </p>
                <p className="text-xs font-black text-primary">{formatCurrency(item.unitPrice * item.quantity)}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all rounded-full opacity-0 group-hover:opacity-100"
                onClick={() => removeProduct(item.product.variantId)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="p-5 bg-primary/5 border-t border-border/50">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subtotal</span>
            <span className="text-2xl font-black tracking-tighter text-primary">{formatCurrency(totalValue())}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
