import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  Button, 
  SbEmptyState,
  cn 
} from '@sb/ui';
import { formatCurrency, formatDimensions } from '@sb/utils';
import { useCartStore } from '../../store/cartStore';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const navigate = useNavigate();
  const { 
    slabs, 
    products, 
    removeSlab, 
    removeProduct, 
    updateProductQty, 
    totalItems, 
    totalValue,
    clear 
  } = useCartStore();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/orders/new');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-0 top-0 h-full w-full sm:max-w-md rounded-none border-l border-border bg-background p-0 shadow-2xl transition-all duration-500 animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 border-b border-border/50 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black tracking-tight">PO Cart</DialogTitle>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {totalItems()} {totalItems() === 1 ? 'item' : 'items'} ready to order
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {totalItems() === 0 ? (
              <SbEmptyState
                icon={<ShoppingCart className="h-10 w-10 text-muted-foreground/20" />}
                title="Your cart is empty"
                description="Browse the catalog to add slabs and products to your next purchase order."
                className="mt-12"
              />
            ) : (
              <>
                {/* Slabs Section */}
                {slabs.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Slabs</h3>
                    <div className="space-y-3">
                      {slabs.map((item) => (
                        <div key={item.slab.id} className="flex gap-4 p-3 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all group shadow-sm">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40">
                            {item.slab.primaryPhotoUrl && (
                              <img src={item.slab.primaryPhotoUrl} className="h-full w-full object-cover" alt="" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-foreground">{item.slab.materialName}</p>
                            <p className="text-[10px] text-muted-foreground font-medium mb-1 truncate">
                              {formatDimensions(item.slab.grossLengthMm, item.slab.grossWidthMm)}
                            </p>
                            <p className="text-sm font-black text-primary">{formatCurrency(item.unitPrice)}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                            onClick={() => removeSlab(item.slab.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {products.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Products</h3>
                    <div className="space-y-3">
                      {products.map((item) => (
                        <div key={item.product.variantId} className="flex gap-4 p-3 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all group shadow-sm">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40 flex items-center justify-center">
                            {item.product.primaryPhotoUrl ? (
                              <img src={item.product.primaryPhotoUrl} className="h-full w-full object-cover" alt="" />
                            ) : (
                              <ShoppingCart className="h-6 w-6 text-muted-foreground/20" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-foreground">{item.product.productName}</p>
                            <p className="text-[10px] text-muted-foreground font-medium mb-2 truncate">
                              {item.product.variantName}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-black text-primary">{formatCurrency(item.unitPrice * item.quantity)}</p>
                              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-xs font-bold" 
                                  onClick={() => updateProductQty(item.product.variantId, Math.max(1, item.quantity - 1))}
                                >-</Button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-xs font-bold"
                                  onClick={() => updateProductQty(item.product.variantId, item.quantity + 1)}
                                >+</Button>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                            onClick={() => removeProduct(item.product.variantId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {totalItems() > 0 && (
            <div className="p-6 border-t border-border/50 bg-card space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
              <div className="flex items-baseline justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estimated Total</span>
                <span className="text-3xl font-black tracking-tighter text-foreground">{formatCurrency(totalValue())}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="w-full h-12 font-black uppercase tracking-widest text-xs shadow-lg group" onClick={handleCheckout}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500" onClick={clear}>
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
