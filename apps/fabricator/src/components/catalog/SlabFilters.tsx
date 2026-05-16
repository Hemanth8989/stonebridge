import React from 'react';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem,
  Input,
  Checkbox,
  Label,
  Button
} from '@sb/ui';
import { X } from 'lucide-react';
import type { SlabSearchParams } from '@sb/types';

interface SlabFiltersProps {
  filters: SlabSearchParams;
  onChange: (filters: SlabSearchParams) => void;
}

export default function SlabFilters({ filters, onChange }: SlabFiltersProps) {
  const handleReset = () => {
    onChange({
      page: 1,
      perPage: filters.perPage || 24,
      sortBy: 'updated_at',
      sortDir: 'DESC',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 py-2">
      <div className="flex items-center gap-2">
        <Select
          value={filters.materialTypes?.[0] || 'all'}
          onValueChange={(v) => onChange({ ...filters, materialTypes: v === 'all' ? undefined : [v as any] })}
        >
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Materials</SelectItem>
            <SelectItem value="granite">Granite</SelectItem>
            <SelectItem value="marble">Marble</SelectItem>
            <SelectItem value="quartz">Quartz</SelectItem>
            <SelectItem value="quartzite">Quartzite</SelectItem>
            <SelectItem value="porcelain">Porcelain</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.colorFamilies?.[0] || 'all'}
          onValueChange={(v) => onChange({ ...filters, colorFamilies: v === 'all' ? undefined : [v as any] })}
        >
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="gray">Gray</SelectItem>
            <SelectItem value="beige">Beige</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 border-l border-border pl-4">
        <div className="flex items-center gap-1.5">
          <Input 
            placeholder="Min $" 
            type="number" 
            className="w-20 h-9 text-xs" 
            value={filters.priceMin || ''} 
            onChange={(e) => onChange({ ...filters, priceMin: Number(e.target.value) || undefined })}
          />
          <span className="text-muted-foreground text-xs">-</span>
          <Input 
            placeholder="Max $" 
            type="number" 
            className="w-20 h-9 text-xs" 
            value={filters.priceMax || ''} 
            onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) || undefined })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 border-l border-border pl-4">
        <Checkbox 
          id="remnants" 
          checked={!!filters.isRemnant}
          onCheckedChange={(checked) => onChange({ ...filters, isRemnant: !!checked })}
        />
        <Label htmlFor="remnants" className="text-xs font-medium cursor-pointer">Remnants</Label>
      </div>

      <Button variant="ghost" size="sm" className="h-9 px-3 text-xs text-muted-foreground" onClick={handleReset}>
        <X className="mr-2 h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
}
