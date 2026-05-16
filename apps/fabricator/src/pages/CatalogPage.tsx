import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  LayoutGrid, 
  List, 
  Search, 
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  Button, 
  Input, 
  Tabs, 
  TabsList, 
  TabsTrigger,
  SbSearchInput,
  SbSpinner,
  cn 
} from '@sb/ui';
import { useCatalogSlabs } from '../hooks/useCatalogSlabs';
import SlabGrid from '../components/catalog/SlabGrid';
import SlabFilterSidebar from '../components/catalog/SlabFilterSidebar';
import type { SlabSearchParams } from '@sb/types';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Parse filters from URL
  const filters: SlabSearchParams = {
    page: Number(searchParams.get('page')) || 1,
    perPage: 24,
    searchQuery: searchParams.get('q') || undefined,
    materialTypes: searchParams.get('material') ? [searchParams.get('material') as any] : undefined,
    colorFamilies: searchParams.get('color') ? [searchParams.get('color') as any] : undefined,
    finishes: searchParams.get('finish') ? [searchParams.get('finish') as any] : undefined,
    priceMin: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    priceMax: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    isRemnant: searchParams.get('isRemnant') === 'true' || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'updated_at',
    sortDir: (searchParams.get('sortDir') as any) || 'DESC',
  };

  const { data, isLoading, isPlaceholderData } = useCatalogSlabs(filters);

  const updateFilters = (newFilters: SlabSearchParams) => {
    const params = new URLSearchParams();
    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    if (newFilters.materialTypes?.[0]) params.set('material', newFilters.materialTypes[0]);
    if (newFilters.colorFamilies?.[0]) params.set('color', newFilters.colorFamilies[0]);
    if (newFilters.finishes?.[0]) params.set('finish', newFilters.finishes[0]);
    if (newFilters.priceMin) params.set('minPrice', newFilters.priceMin.toString());
    if (newFilters.priceMax) params.set('maxPrice', newFilters.priceMax.toString());
    if (newFilters.isRemnant) params.set('isRemnant', 'true');
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.sortDir) params.set('sortDir', newFilters.sortDir);
    setSearchParams(params);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] -m-6 overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar Filters */}
      <aside 
        className={cn(
          "h-full border-r border-border/50 bg-card transition-all duration-500",
          isSidebarOpen ? "w-[280px]" : "w-0 overflow-hidden border-none"
        )}
      >
        <SlabFilterSidebar 
          filters={filters} 
          onChange={updateFilters} 
          totalResults={data?.meta?.totalCount || 0}
        />
      </aside>

      {/* Main Catalog Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Sub-header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className={cn("h-9 w-9 rounded-xl border-border/50 shadow-sm transition-colors", !isSidebarOpen && "bg-primary text-white border-primary")}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            
            <div className="hidden sm:flex items-center bg-muted/50 rounded-xl p-1 shadow-inner border border-border/20">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg", view === 'grid' && "bg-background shadow-sm text-primary")}
                onClick={() => setView('grid')}
              >
                <LayoutGrid className="mr-1.5 h-3 w-3" />
                Grid
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg", view === 'list' && "bg-background shadow-sm text-primary")}
                onClick={() => setView('list')}
              >
                <List className="mr-1.5 h-3 w-3" />
                List
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Pagination Controls */}
            {data?.meta && data.meta.totalCount > filters.perPage! && (
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Page <span className="text-foreground">{filters.page}</span> of {Math.ceil(data.meta.totalCount / filters.perPage!)}
                </p>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg"
                    disabled={filters.page === 1 || isLoading}
                    onClick={() => updateFilters({ ...filters, page: filters.page! - 1 })}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg"
                    disabled={filters.page === Math.ceil(data.meta.totalCount / filters.perPage!) || isLoading}
                    onClick={() => updateFilters({ ...filters, page: filters.page! + 1 })}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="h-6 w-[1px] bg-border/60" />
            
            <select 
              className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              value={`${filters.sortBy}:${filters.sortDir}`}
              onChange={(e) => {
                const [sortBy, sortDir] = e.target.value.split(':');
                updateFilters({ ...filters, sortBy: sortBy as any, sortDir: sortDir as any });
              }}
            >
              <option value="updated_at:DESC">Newest First</option>
              <option value="list_price:ASC">Price: Low to High</option>
              <option value="list_price:DESC">Price: High to Low</option>
              <option value="material_name:ASC">Material: A-Z</option>
            </select>
          </div>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          {isLoading && !isPlaceholderData ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px] z-20">
              <div className="flex flex-col items-center gap-3">
                <SbSpinner size="lg" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Syncing Marketplace...</p>
              </div>
            </div>
          ) : null}

          <SlabGrid 
            slabs={data?.data || []} 
            loading={isLoading} 
            view={view} 
          />
        </div>
      </div>
    </div>
  );
}
