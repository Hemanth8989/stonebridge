import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SbDataTable, Button } from '@sb/ui';
import { formatCurrency } from '@sb/utils';

interface AgingItem {
  slabId: string;
  materialName: string;
  internalRef: string;
  daysInStock: number;
  listPrice: number;
}

interface InventoryAgingTableProps {
  data?: AgingItem[];
  loading?: boolean;
}

export default function InventoryAgingTable({ data = [], loading }: InventoryAgingTableProps) {
  const navigate = useNavigate();

  return (
    <SbDataTable
      loading={loading}
      data={data.sort((a, b) => b.daysInStock - a.daysInStock)}
      keyExtractor={(row) => row.slabId}
      columns={[
        {
          key: 'slab',
          header: 'Slab',
          render: (row) => (
            <div>
              <div className="font-mono text-xs text-muted-foreground">{row.internalRef}</div>
              <div className="font-medium text-sm">{row.materialName}</div>
            </div>
          ),
        },
        {
          key: 'daysInStock',
          header: 'Days in Stock',
          render: (row) => {
            const isRed = row.daysInStock > 90;
            const isAmber = row.daysInStock > 30 && !isRed;
            return (
              <span className={`font-semibold ${isRed ? 'text-red-600 dark:text-red-400' : isAmber ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                {row.daysInStock}
              </span>
            );
          },
        },
        {
          key: 'listPrice',
          header: 'List Price',
          render: (row) => <span>{formatCurrency(row.listPrice)}</span>,
        },
        {
          key: 'actions',
          header: 'Action',
          render: (row) => (
            <Button variant="outline" size="sm" onClick={() => navigate(`/inventory/${row.slabId}/edit`)}>
              Reduce price
            </Button>
          ),
        },
      ]}
    />
  );
}
