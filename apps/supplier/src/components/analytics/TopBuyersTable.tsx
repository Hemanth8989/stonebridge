import React from 'react';
import { SbDataTable, SbAvatar } from '@sb/ui';
import { formatCurrency, formatRelativeTime } from '@sb/utils';

interface TopBuyer {
  fabricatorId: string;
  fabricatorName: string;
  totalSpend: number;
  poCount: number;
  lastOrderAt?: string;
}

interface TopBuyersTableProps {
  data?: TopBuyer[];
  loading?: boolean;
}

export default function TopBuyersTable({ data = [], loading }: TopBuyersTableProps) {
  return (
    <SbDataTable
      loading={loading}
      data={data.sort((a, b) => b.totalSpend - a.totalSpend)}
      keyExtractor={(row) => row.fabricatorId}
      columns={[
        {
          key: 'rank',
          header: '#',
          render: (row) => <span className="text-muted-foreground">{data.indexOf(row) + 1}</span>,
        },
        {
          key: 'fabricator',
          header: 'Fabricator',
          render: (row) => (
            <div className="flex items-center space-x-2">
              <SbAvatar name={row.fabricatorName || 'F'} size="sm" />
              <span className="font-medium">{row.fabricatorName}</span>
            </div>
          ),
        },
        {
          key: 'totalSpend',
          header: 'Total Spend',
          render: (row) => <div className="text-right font-medium">{formatCurrency(row.totalSpend)}</div>,
        },
        {
          key: 'poCount',
          header: 'POs',
          render: (row) => row.poCount,
        },
        {
          key: 'avgValue',
          header: 'Avg Value',
          render: (row) => formatCurrency(row.totalSpend / row.poCount),
        },
        {
          key: 'lastOrder',
          header: 'Last Order',
          render: (row) => row.lastOrderAt ? formatRelativeTime(row.lastOrderAt) : '-',
        },
      ]}
    />
  );
}
