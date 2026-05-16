import React from 'react';
import { 
  Input, 
  Checkbox, 
  Label, 
  Separator, 
  Switch, 
  Button,
  Badge,
  SbSearchInput,
  cn
} from '@sb/ui';
import { X } from 'lucide-react';
import type { SlabSearchParams, MaterialType, ColorFamily, SlabFinish } from '@sb/types';

interface SlabFilterSidebarProps {
  filters: SlabSearchParams;
  onChange: (filters: SlabSearchParams) => void;
  totalResults: number;
}

const colorFamilies: { family: ColorFamily; hex: string }[] = [
  { family: 'white', hex: '#F5F5F0' },
  { family: 'cream', hex: '#F5EDD6' },
  { family: 'beige', hex: '#D4B896' },
  { family: 'gray', hex: '#9E9E9E' },
  { family: 'charcoal', hex: '#4A4A4A' },
  { family: 'black', hex: '#1A1A1A' },
  { family: 'blue', hex: '#4A90D9' },
  { family: 'green', hex: '#5BA85A' },
  { family: 'red', hex: '#C0392B' },
  { family: 'brown', hex: '#795548' },
  { family: 'gold', hex: '#DAA520' },
];

const materialTypes: MaterialType[] = ['granite', 'marble', 'quartz', 'quartzite', 'porcelain', 'dekton', 'limestone', 'travertine', 'onyx', 'slate', 'soapstone'];
const finishes: SlabFinish[] = ['polished', 'honed', 'leathered', 'brushed', 'natural'];

export default function SlabFilterSidebar({ filters, onChange, totalResults }: SlabFilterSidebarProps) {
  const toggleArrayItem = (key: keyof SlabSearchParams, value: any) => {
    const current = (filters[key] as any[]) || [];
    const updated = current.includes(value)
      ? current.filter((i) => i !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated.length > 0 ? updated : undefined, page: 1 });
  };

  const handleClearAll = () => {
    onChange({
      page: 1,
      perPage: filters.perPage || 24,
      sortBy: 'updated_at',
      sortDir: 'DESC',
    });
  };

  const activeCount = 
    (filters.materialTypes?.length || 0) + 
    (filters.colorFamilies?.length || 0) + 
    (filters.finishes?.length || 0) + 
    (filters.priceMin || filters.priceMax ? 1 : 0) + 
    (filters.isRemnant ? 1 : 0);

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Filters</h2>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary font-bold hover:bg-transparent" onClick={handleClearAll}>
              Clear all
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <SbSearchInput 
            placeholder="Search material..." 
            className="bg-muted/50 border-none h-9"
            value={filters.searchQuery || ''}
            onChange={(val) => onChange({ ...filters, searchQuery: val, page: 1 })}
          />
        </div>

        {/* Material Type */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Material Type</Label>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {materialTypes.slice(0, 8).map((type) => (
              <div key={type} className="flex items-center space-x-2 group cursor-pointer" onClick={() => toggleArrayItem('materialTypes', type)}>
                <Checkbox 
                  id={`mat-${type}`} 
                  checked={filters.materialTypes?.includes(type)}
                  className="data-[state=checked]:bg-primary pointer-events-none"
                />
                <Label className="text-xs font-medium cursor-pointer capitalize group-hover:text-primary transition-colors">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Color Family */}
        <div className="space-y-3">
          <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Color Family</Label>
          <div className="flex flex-wrap gap-2.5">
            {colorFamilies.map(({ family, hex }) => (
              <div
                key={family}
                title={family}
                className={cn(
                  "h-6 w-6 rounded-full cursor-pointer border-2 transition-all shadow-sm ring-offset-background hover:scale-110",
                  filters.colorFamilies?.includes(family) 
                    ? "border-primary ring-2 ring-primary ring-offset-2" 
                    : "border-transparent"
                )}
                style={{ backgroundColor: hex }}
                onClick={() => toggleArrayItem('colorFamilies', family)}
              />
            ))}
            <div 
              title="multi"
              className={cn(
                "h-6 w-6 rounded-full cursor-pointer border-2 transition-all shadow-sm ring-offset-background hover:scale-110",
                filters.colorFamilies?.includes('multi') 
                  ? "border-primary ring-2 ring-primary ring-offset-2" 
                  : "border-transparent"
              )}
              style={{ background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)' }}
              onClick={() => toggleArrayItem('colorFamilies', 'multi')}
            />
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Finish */}
        <div className="space-y-3">
          <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Finish</Label>
          <div className="grid grid-cols-2 gap-2.5">
            {finishes.map((finish) => (
              <div key={finish} className="flex items-center space-x-2 group cursor-pointer" onClick={() => toggleArrayItem('finishes', finish)}>
                <Checkbox 
                  id={`fin-${finish}`} 
                  checked={filters.finishes?.includes(finish)}
                  className="pointer-events-none"
                />
                <Label className="text-xs font-medium cursor-pointer capitalize group-hover:text-primary transition-colors">
                  {finish}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Price ($ / sq ft)</Label>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Min" 
              type="number" 
              className="h-8 text-xs bg-muted/30 border-border/50" 
              value={filters.priceMin || ''}
              onChange={(e) => onChange({ ...filters, priceMin: Number(e.target.value) || undefined, page: 1 })}
            />
            <span className="text-muted-foreground text-xs font-bold">to</span>
            <Input 
              placeholder="Max" 
              type="number" 
              className="h-8 text-xs bg-muted/30 border-border/50" 
              value={filters.priceMax || ''}
              onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) || undefined, page: 1 })}
            />
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Remnants Only */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold">Remnants only</Label>
            <p className="text-[10px] text-muted-foreground font-medium">Small-sized offcuts</p>
          </div>
          <Switch 
            checked={!!filters.isRemnant}
            onCheckedChange={(checked) => onChange({ ...filters, isRemnant: !!checked, page: 1 })}
          />
        </div>
      </div>

      <div className="p-4 border-t border-border/50 bg-accent/10">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {totalResults} slabs found
        </p>
      </div>
    </div>
  );
}
