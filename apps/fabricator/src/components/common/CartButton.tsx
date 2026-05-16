import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@sb/ui';
import { useCartStore } from '../../store/cartStore';
import CartDrawer from '../orders/CartDrawer';

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative" 
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in fade-in zoom-in duration-300">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </Button>

      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
