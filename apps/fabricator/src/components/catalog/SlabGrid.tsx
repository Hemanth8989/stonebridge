import React from 'react';
import { 
  SbDataTable, 
  SbSpinner, 
  SbEmptyState, 
  SlabStatusBadge,
  SbAvatar,
  SbPriceDisplay,
  Button
} from '@sb/ui';
import { formatDimensions, formatArea } from '@sb/utils';
import { Layers, ShoppingCart, Check } from 'lucide-react';
import type { CatalogSlab } from '@sb/types';
import { useCartStore } from '../../store/cartStore';
import SlabCard from './SlabCard';

interface SlabGridProps {
  slabs: CatalogSlab[];
  loading: boolean;
  view: 'grid' | 'list';
}

export default function SlabGrid({ slabs, loading, view }: SlabGridProps) {
  const addSlab = useCartStore((state) => state.addSlab);
  const isSlabInCart = useCartStore((state) => state.isSlabInCart);

  if (loading && slabs.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <SbSpinner size="lg" />
      </div>
    );
  }

  if (slabs.length === 0) {
    return (
      <SbEmptyState
        icon={<Layers className="h-10 w-10" />}
        title="No slabs found"
        description="Try adjusting your filters or search query to find what you're looking for."
      />
    );
  }

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {slabs.map((slab) => (
          <SlabCard
            key={slab.id}
            slab={slab}
            onAddToCart={addSlab}
            isInCart={isSlabInCart(slab.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
      <SbDataTable
        keyExtractor={(item) => item.id}
        data={slabs}
        columns={[
          {
            key: 'photo',
            header: 'Photo',
            width: '80px',
            render: (row) => (
              <div className="h-14 w-14 overflow-hidden rounded-md bg-muted">
                {row.primaryPhotoUrl && (
                  <img src={row.primaryPhotoUrl} className="h-full w-full object-cover" alt="" />
                )}
              </div>
            ),
          },
          {
            key: 'material',
            header: 'Material',
            render: (row) => (
              <div>
                <p className="font-semibold text-sm">{row.materialName}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  {row.colorFamily} · {row.finish}
                </p>
              </div>
            ),
          },
          {
            key: 'specs',
            header: 'Specs',
            render: (row) => (
              <div className="text-xs">
                <p>{formatDimensions(row.grossLengthMm, row.grossWidthMm)}</p>
                <p className="text-muted-foreground">{formatArea(row.netSqft)}</p>
              </div>
            ),
          },
          {
            key: 'price',
            header: 'Price',
            render: (row) => <SbPriceDisplay amount={row.listPrice || 0} unit="sq ft" size="sm" />,
          },
          {
            key: 'supplier',
            header: 'Supplier',
            render: (row) => (
              <div className="flex items-center gap-2">
                <SbAvatar name={row.supplierName} size="xs" />
                <span className="text-xs font-medium">{row.supplierName}</span>
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <SlabStatusBadge status={row.status} />,
          },
          {
            key: 'actions',
            header: '',
            align: 'right',
            render: (row) => {
              const inCart = isSlabInCart(row.id);
              return (
                <Button
                  size="sm"
                  variant={inCart ? 'secondary' : 'default'}
                  className="h-8 px-3 text-[11px] font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!inCart && row.status === 'available') addSlab(row);
                  }}
                  disabled={row.status !== 'available'}
                >
                  {inCart ? (
                    <>
                      <Check className="mr-1.5 h-3 w-3" />
                      In cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-1.5 h-3 w-3" />
                      Add to PO
                    </>
                  )}
                </Button>
              );
            },
          },
        ]}
      />
    </div>
  );
}
