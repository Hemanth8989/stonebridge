import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  Button, 
  SbSearchInput, 
  SbSpinner, 
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  cn 
} from '@sb/ui';
import { useCatalogProducts } from '../hooks/useCatalogProducts';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/catalog/ProductCard';

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'sink', label: 'Sinks' },
  { id: 'adhesive', label: 'Adhesives' },
  { id: 'sealer', label: 'Sealers & Care' },
  { id: 'tool', label: 'Tools & Hardware' },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useCatalogProducts({ 
    productCategories: activeCategory === 'all' ? undefined : [activeCategory as any],
    searchQuery 
  });
  const addProduct = useCartStore((state) => state.addProduct);
  const isProductInCart = useCartStore((state) => state.isProductInCart);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Material Essentials</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 italic">
            Add sinks, adhesives, and tools to your purchase orders.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <SbSearchInput 
              placeholder="Search products..." 
              className="w-[280px] h-11 bg-card/50 border-border/50 group-hover:border-primary/30 transition-all shadow-sm"
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/50 bg-card/50">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="bg-muted/40 p-1.5 h-14 rounded-2xl border border-border/20 shadow-inner">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id}
              className="rounded-xl px-8 h-11 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <SbSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {data?.data.map((product) => (
            <ProductCard
              key={product.variantId}
              product={product}
              onAddToCart={addProduct}
              isInCart={isProductInCart(product.variantId)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && data?.data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 rounded-full bg-muted/40 flex items-center justify-center mb-6">
            <Package className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-black tracking-tight">No products found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[300px]">
            We couldn't find any products matching your search or category selection.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-6 font-black uppercase tracking-widest text-[10px]"
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Pagination Placeholder */}
      {data?.meta && data.meta.totalCount > 20 && (
        <div className="flex items-center justify-center pt-12">
          <div className="flex items-center gap-2 bg-card border border-border/50 rounded-xl p-1.5 shadow-sm">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" disabled><ChevronLeft className="h-4 w-4" /></Button>
            <div className="flex items-center px-4">
              <span className="text-xs font-black">1 / 5</span>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
