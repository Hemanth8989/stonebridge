import React from 'react';
import { Image } from 'lucide-react';
import { Card, SlabStatusBadge, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, Button } from '@sb/ui';
import { formatCurrency, formatDimensions } from '@sb/utils';
import type { Slab, SlabStatus } from '@sb/types';
import SlabStatusMenu from './SlabStatusMenu';

interface SlabCardProps {
  slab: Slab;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, status: SlabStatus) => void;
}

export default function SlabCard({ slab: rawSlab, onEdit, onStatusChange }: SlabCardProps) {
  const slab = rawSlab as any;
  const price = slab.priceOverride ?? slab.listPrice ?? slab.basePrice ?? 0;

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
      <div className="aspect-square bg-muted relative border-b border-border">
        {slab.primaryPhotoUrl ? (
          <img src={slab.primaryPhotoUrl} alt={slab.materialName} className="object-cover w-full h-full" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Image className="w-10 h-10 opacity-20" />
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground leading-tight truncate" title={slab.materialName}>
            {slab.materialName}
          </h3>
          <div className="text-xs text-muted-foreground mt-0.5">
            {slab.thicknessCm}cm {slab.finish}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDimensions(slab.grossLengthMm, slab.grossWidthMm)}
          </div>
          <div className="font-medium text-foreground mt-1">
            {formatCurrency(price)}/sq ft
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <SlabStatusBadge status={slab.status} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="sr-only">Open menu</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M3.625 7.5C3.625 8.12132 3.11764 8.625 2.5 8.625C1.88236 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.88236 6.375 2.5 6.375C3.11764 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.11764 8.625 7.5 8.625C6.88236 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.88236 6.375 7.5 6.375C8.11764 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1176 8.625 12.5 8.625C11.8824 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8824 6.375 12.5 6.375C13.1176 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(slab.id)}>Edit slab</DropdownMenuItem>
              <DropdownMenuSeparator />
              <SlabStatusMenu currentStatus={slab.status} onStatusChange={(s) => onStatusChange(slab.id, s)} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground font-mono truncate" title={slab.internalRef}>
          {slab.internalRef}
        </div>
      </div>
    </Card>
  );
}
