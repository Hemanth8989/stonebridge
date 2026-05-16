import React from 'react';
import { DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuItem, SlabStatusBadge } from '@sb/ui';
import type { SlabStatus } from '@sb/types';

interface SlabStatusMenuProps {
  currentStatus: SlabStatus;
  onStatusChange: (status: SlabStatus) => void;
}

const allStatuses: SlabStatus[] = ['available', 'reserved', 'allocated', 'shipped', 'hold', 'sold'];

export default function SlabStatusMenu({ currentStatus, onStatusChange }: SlabStatusMenuProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {allStatuses.map((status) => {
            if (status === currentStatus) return null;
            const disabled = currentStatus === 'sold' || currentStatus === 'shipped';
            return (
              <DropdownMenuItem 
                key={status} 
                onClick={() => onStatusChange(status)}
                disabled={disabled}
              >
                <div className="flex items-center">
                  <SlabStatusBadge status={status} />
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
