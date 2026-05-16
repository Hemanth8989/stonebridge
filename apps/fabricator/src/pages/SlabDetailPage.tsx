import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ShoppingCart, 
  Check, 
  MapPin, 
  Building2, 
  Info,
  Maximize2,
  Share2,
  Heart,
  Truck,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { 
  Button, 
  Badge, 
  Card, 
  CardContent, 
  SbSpinner, 
  SbPriceDisplay, 
  SlabStatusBadge,
  SbAvatar,
  Separator,
  cn 
} from '@sb/ui';
import { formatDimensions, formatArea, formatDate } from '@sb/utils';
import { useSlabDetail } from '../hooks/useCatalogSlabs';
import { useCartStore } from '../store/cartStore';

export default function SlabDetailPage() {
  const { slabId } = useParams();
  const navigate = useNavigate();
  const { data: slabResponse, isLoading } = useSlabDetail(slabId!);
  const slab = slabResponse?.data;
  
  const addSlab = useCartStore((state) => state.addSlab);
  const isSlabInCart = useCartStore((state) => state.isSlabInCart);
  
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><SbSpinner size="lg" /></div>;
  if (!slab) return <div className="p-12 text-center">Slab not found</div>;

  const inCart = isSlabInCart(slab.id);
  const photos = (slab as any)?.photos || (slab.primaryPhotoUrl ? [{ id: 'primary', url: slab.primaryPhotoUrl, isPrimary: true }] : []);

  const handleAddToCart = () => {
    if (inCart) {
      navigate('/orders/new');
    } else {
      addSlab(slab);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs font-bold hover:bg-transparent p-0 group"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Catalog
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9"><Share2 className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="rounded-full h-9 w-9"><Heart className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Photos */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/50 shadow-2xl bg-muted group">
            {photos.length > 0 ? (
              <img 
                src={photos[activePhotoIndex]?.url} 
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={slab.materialName} 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground/30 font-black uppercase tracking-widest">No Photos</div>
            )}
            <div className="absolute top-6 left-6 pointer-events-none">
              <SlabStatusBadge status={slab.status} />
            </div>
            <Button variant="secondary" size="icon" className="absolute bottom-6 right-6 h-10 w-10 rounded-xl bg-black/40 text-white hover:bg-black/60 backdrop-blur-md border-none">
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
          
          {photos.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {photos.map((photo: any, i: number) => (
                <button
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(i)}
                  className={cn(
                    "relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                    activePhotoIndex === i ? "border-primary ring-4 ring-primary/10 shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={photo.url} className="h-full w-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-muted text-[10px] font-black uppercase tracking-widest px-2 h-5">{slab.materialType}</Badge>
                {slab.isRemnant && <Badge className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-2 h-5">Remnant</Badge>}
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground">{slab.materialName}</h1>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {slab.colorFamily} · {slab.finish} · Lot {slab.lotNumber}
              </p>
            </div>

            <SbPriceDisplay 
              amount={slab.listPrice || 0} 
              unit="sq ft" 
              size="lg" 
              className="text-primary"
            />
          </div>

          <Separator className="bg-border/40" />

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Maximize2 className="h-3 w-3" />
                Dimensions
              </p>
              <p className="text-sm font-black">{formatDimensions(slab.grossLengthMm, slab.grossWidthMm)}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                Net Area
              </p>
              <p className="text-sm font-black">{formatArea(slab.netSqft)}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3 w-3" />
                Bundle
              </p>
              <p className="text-sm font-black">#{slab.bundleId || 'N/A'}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Sync Date
              </p>
              <p className="text-sm font-black">{formatDate(slab.updatedAt)}</p>
            </div>
          </div>

          {/* Supplier Info */}
          <Card className="border-border/50 bg-muted/20 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SbAvatar name={slab.supplierName} size="md" className="shadow-md" />
                <div>
                  <p className="text-xs font-black text-foreground">{slab.supplierName}</p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Verified Supplier
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary" onClick={() => navigate(`/suppliers`)}>View Profile</Button>
            </CardContent>
          </Card>

          {/* Order Section */}
          <div className="space-y-4 pt-4">
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className={cn(
                  "flex-1 h-14 font-black uppercase tracking-widest text-xs shadow-xl transition-all",
                  inCart ? "bg-green-500 hover:bg-green-600 text-white" : ""
                )}
                onClick={handleAddToCart}
                disabled={slab.status !== 'available'}
              >
                {inCart ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Review Order
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to PO Cart
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-xl border border-border/40 bg-card/50">
                <Truck className="h-4 w-4 text-primary" />
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Shipping</p>
                  <p className="text-[10px] font-black">2-4 Business Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-border/40 bg-card/50">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Verified</p>
                  <p className="text-[10px] font-black">StoneBridge Guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
