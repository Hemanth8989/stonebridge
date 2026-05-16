import React from 'react';
import { ShoppingCart, Check, Package as PackageIcon } from 'lucide-react';
import { 
  Card, 
  Button, 
  Badge, 
  SbPriceDisplay, 
  VariantStatusBadge,
  Input,
  cn 
} from '@sb/ui';
import { titleCase } from '@sb/utils';
import type { CatalogProduct } from '@sb/types';

interface ProductCardProps {
  product: CatalogProduct;
  onAddToCart: (product: CatalogProduct, quantity: number) => void;
  isInCart: boolean;
}

export default function ProductCard({ product, onAddToCart, isInCart }: ProductCardProps) {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <Card className="group h-full flex flex-col overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300">
      {/* Photo Area */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.primaryPhotoUrl ? (
          <img 
            src={product.primaryPhotoUrl} 
            alt={product.productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <PackageIcon className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-2">
        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold uppercase tracking-wide">
          {titleCase(product.productCategory)}
        </Badge>
        
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold leading-tight line-clamp-1 text-foreground group-hover:text-primary transition-colors">
            {product.productName}
          </h3>
          <p className="text-[10px] font-semibold text-muted-foreground">{product.brand}</p>
        </div>
        
        <p className="text-xs font-medium text-foreground/80">{product.variantName}</p>

        {/* Attributes Preview */}
        <div className="flex flex-wrap gap-1.5 py-1">
          {product.attributes && Object.entries(product.attributes).slice(0, 3).map(([key, value]) => (
            <span key={key} className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground">
              {key}: {value as string}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <SbPriceDisplay 
            amount={product.basePrice || 0} 
            unit={product.unitOfMeasure} 
            size="sm" 
          />
          <div className="flex items-center gap-1.5">
            <VariantStatusBadge status={(product as any).variantStatus} />
            <span className="text-[10px] font-semibold text-muted-foreground">
              {product.qtyAvailable} {product.unitOfMeasure}s
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-4 mt-auto">
        {isInCart ? (
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full text-xs font-semibold bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20"
            disabled
          >
            <Check className="mr-2 h-3.5 w-3.5" />
            In cart ✓
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input 
              type="number" 
              min={1} 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="h-9 w-16 text-center text-xs font-bold"
            />
            <Button 
              size="sm" 
              className="flex-1 text-xs font-semibold shadow-sm"
              onClick={() => onAddToCart(product, quantity)}
            >
              <ShoppingCart className="mr-2 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
