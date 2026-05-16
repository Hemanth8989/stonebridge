import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Check, Image as ImageIcon } from 'lucide-react';
import { 
  Card, 
  Button, 
  Badge, 
  SbAvatar, 
  SbPriceDisplay, 
  SlabStatusBadge,
  cn 
} from '@sb/ui';
import { formatDimensions, formatArea } from '@sb/utils';
import type { CatalogSlab } from '@sb/types';

interface SlabCardProps {
  slab: CatalogSlab;
  onAddToCart: (slab: CatalogSlab) => void;
  isInCart: boolean;
  className?: string;
}

export default function SlabCard({ slab, onAddToCart, isInCart, className }: SlabCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/catalog/${slab.id}`);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      navigate('/orders/new');
    } else {
      onAddToCart(slab);
    }
  };

  return (
    <Card 
      className={cn(
        "group h-full flex flex-col overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Photo Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {slab.primaryPhotoUrl ? (
          <img 
            src={slab.primaryPhotoUrl} 
            alt={slab.materialName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {slab.isRemnant && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm text-[10px] h-5 px-1.5">
              Remnant
            </Badge>
          )}
          {slab.supplierVerified && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm text-[10px] h-5 px-1.5 flex gap-1">
              Verified
            </Badge>
          )}
        </div>
        
        <div className="absolute top-3 right-3 pointer-events-none shadow-sm">
          <SlabStatusBadge status={slab.status} />
        </div>
        
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-bold leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {slab.materialName}
          </h3>
        </div>
        
        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80">
          {slab.colorFamily} · {slab.finish}
        </p>

        <div className="flex items-center text-xs text-muted-foreground gap-1.5 py-1">
          <span>{formatDimensions(slab.grossLengthMm, slab.grossWidthMm)}</span>
          <span className="text-border">|</span>
          <span className="font-medium text-foreground/80">{formatArea(slab.netSqft)}</span>
        </div>

        <div className="pt-1">
          <SbPriceDisplay 
            amount={slab.listPrice || 0} 
            unit="sq ft" 
            size="sm" 
          />
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/40 mt-3">
          <SbAvatar name={slab.supplierName} size="xs" />
          <span className="text-[10px] font-medium text-muted-foreground truncate">
            {slab.supplierName}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-4 mt-auto">
        {slab.status === 'available' ? (
          <Button 
            variant={isInCart ? "secondary" : "default"} 
            size="sm" 
            className={cn(
              "w-full text-xs font-semibold shadow-sm transition-all",
              isInCart ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" : ""
            )}
            onClick={handleAddClick}
          >
            {isInCart ? (
              <>
                <Check className="mr-2 h-3.5 w-3.5" />
                In PO cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-3.5 w-3.5" />
                Add to PO cart
              </>
            )}
          </Button>
        ) : (
          <Button disabled variant="outline" size="sm" className="w-full text-xs opacity-50">
            Unavailable
          </Button>
        )}
      </div>
    </Card>
  );
}
