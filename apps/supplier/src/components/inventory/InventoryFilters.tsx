import React from 'react';
import { X } from 'lucide-react';
import { Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Checkbox, Button } from '@sb/ui';
import type { MaterialType, ColorFamily, SlabFinish, SlabStatus, QualityGrade } from '@sb/types';

export interface InventoryFilterState {
  materialType?: MaterialType;
  colorFamily?: ColorFamily;
  finish?: SlabFinish;
  status?: SlabStatus;
  qualityGrade?: QualityGrade;
  searchQuery?: string;
  isRemnant?: boolean;
}

interface InventoryFiltersProps {
  filters: InventoryFilterState;
  onChange: (filters: InventoryFilterState) => void;
}

export default function InventoryFilters({ filters, onChange }: InventoryFiltersProps) {
  const update = (key: keyof InventoryFilterState, value: any) => {
    onChange({ ...filters, [key]: value === 'all' || value === '' ? undefined : value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '' && v !== false);

  return (
    <div className="space-y-3 flex-1">
      <div className="flex flex-wrap gap-2 items-center">
        <Input 
          placeholder="Search materials, ref, lot..." 
          className="w-[200px]" 
          value={filters.searchQuery || ''}
          onChange={(e) => update('searchQuery', e.target.value)}
        />
        
        <Select value={filters.materialType || 'all'} onValueChange={(v) => update('materialType', v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Material" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All materials</SelectItem>
            <SelectItem value="granite">Granite</SelectItem>
            <SelectItem value="marble">Marble</SelectItem>
            <SelectItem value="quartzite">Quartzite</SelectItem>
            <SelectItem value="quartz">Quartz</SelectItem>
            <SelectItem value="porcelain">Porcelain</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.colorFamily || 'all'} onValueChange={(v) => update('colorFamily', v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Color" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All colors</SelectItem>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="gray">Gray</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status || 'all'} onValueChange={(v) => update('status', v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2 border border-border rounded-md px-3 h-10 bg-card">
          <Checkbox 
            id="remnants" 
            checked={!!filters.isRemnant} 
            onCheckedChange={(c) => update('isRemnant', c)} 
          />
          <label htmlFor="remnants" className="text-sm font-medium leading-none cursor-pointer">
            Remnants only
          </label>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange({})}>
            Clear filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <div key={key} className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold bg-muted/50 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>: {value.toString()}
                <button 
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => update(key as any, undefined)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
