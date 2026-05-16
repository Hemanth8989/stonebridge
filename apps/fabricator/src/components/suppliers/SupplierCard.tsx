import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ShoppingCart, 
  Search,
  ExternalLink 
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Badge, 
  SbAvatar, 
  SbVerifiedBadge,
  SbSpinner,
  cn 
} from '@sb/ui';
import type { SupplierDirectory } from '@sb/types';

interface SupplierCardProps {
  supplier: SupplierDirectory;
  onRequestConnection?: (supplierId: string) => void;
  isPending?: boolean;
}

export default function SupplierCard({ supplier, onRequestConnection, isPending }: SupplierCardProps) {
  const navigate = useNavigate();
  const isConnected = supplier.connection?.status === 'active';
  const isPendingConnection = supplier.connection?.status === 'pending';

  const handleBrowse = () => {
    navigate(`/catalog?supplierId=${supplier.tenantId}`);
  };

  const handleNewPO = () => {
    navigate('/orders/new');
  };

  return (
    <Card className="group flex flex-col h-full overflow-hidden border-border/50 bg-card hover:shadow-lg transition-all duration-300">
      <div className="p-5 flex-1 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <SbAvatar 
            name={supplier.displayName} 
            src={supplier.logoUrl || undefined} 
            size="lg" 
            className="shadow-md ring-2 ring-background ring-offset-2"
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-sm font-black tracking-tight text-foreground truncate">{supplier.displayName}</h3>
              {supplier.verified && <SbVerifiedBadge verified={supplier.verified} />}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider truncate">
                {supplier.city}, {supplier.stateProvince} · {supplier.country}
              </span>
            </div>
          </div>
        </div>

        {/* Status & Pricing Tier */}
        <div className="flex flex-wrap gap-2">
          {isConnected ? (
            <>
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-none text-[9px] font-black uppercase tracking-widest px-2 h-5 shadow-sm">
                <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                Connected
              </Badge>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 h-5 bg-primary/5 text-primary border-primary/20">
                Tier: {supplier.connection?.pricingTier || 'Standard'}
              </Badge>
            </>
          ) : isPendingConnection ? (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none text-[9px] font-black uppercase tracking-widest px-2 h-5 shadow-sm">
              <Clock className="h-2.5 w-2.5 mr-1" />
              Request Pending
            </Badge>
          ) : null}
        </div>

        {/* Stats Row (if connected) */}
        {isConnected && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/40 rounded-lg p-2 flex flex-col items-center justify-center text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Fulfillment</p>
              <p className="text-xs font-black text-green-600">98%</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-2 flex flex-col items-center justify-center text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Avg Lead</p>
              <p className="text-xs font-black text-primary">4.2d</p>
            </div>
            <div className="bg-muted/40 rounded-lg p-2 flex flex-col items-center justify-center text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Response</p>
              <p className="text-xs font-black text-amber-600">1.5h</p>
            </div>
          </div>
        )}

        {!isConnected && !isPendingConnection && (
          <p className="text-xs text-muted-foreground/80 leading-relaxed italic line-clamp-2">
            Connect to view this supplier's live slab inventory and product catalog.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 bg-muted/20 border-t border-border/40 mt-auto">
        {isConnected ? (
          <div className="flex gap-2">
            <Button 
              className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest shadow-sm"
              onClick={handleBrowse}
            >
              <Search className="h-3.5 w-3.5 mr-1.5" />
              Browse
            </Button>
            <Button 
              variant="outline"
              className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest shadow-sm border-border/50"
              onClick={handleNewPO}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              New PO
            </Button>
          </div>
        ) : isPendingConnection ? (
          <Button disabled className="w-full h-9 text-[10px] font-black uppercase tracking-widest opacity-50">
            Request Pending
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full h-9 text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
            onClick={() => onRequestConnection?.(supplier.tenantId)}
            disabled={isPending}
          >
            {isPending ? <SbSpinner size="sm" className="mr-2" /> : <ExternalLink className="h-3.5 w-3.5 mr-1.5" />}
            Request Access
          </Button>
        )}
      </div>
    </Card>
  );
}
