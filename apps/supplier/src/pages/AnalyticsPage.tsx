import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@sb/api-client';
import { SbPageHeader, SbStatCard, Card, CardHeader, CardTitle, CardContent, SbSpinner } from '@sb/ui';
import RevenueChart from '../components/analytics/RevenueChart';
import TopBuyersTable from '../components/analytics/TopBuyersTable';
import InventoryAgingTable from '../components/analytics/InventoryAgingTable';

// Mock API call
const getSupplierAnalytics = async () => {
  return {
    totalRevenueMonth: 125000,
    posFulfilled: 42,
    avgResponseHrs: 2.4,
    fulfillmentRate: 98,
    revenueByMonth: [
      { month: 'Jan', revenue: 95000 },
      { month: 'Feb', revenue: 102000 },
      { month: 'Mar', revenue: 115000 },
      { month: 'Apr', revenue: 110000 },
      { month: 'May', revenue: 125000 },
    ],
    topBuyers: [
      { fabricatorId: '1', fabricatorName: 'Granite Pros', totalSpend: 45000, poCount: 12, lastOrderAt: new Date().toISOString() },
      { fabricatorId: '2', fabricatorName: 'Elite Stone', totalSpend: 38000, poCount: 8, lastOrderAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
    inventoryAging: [
      { slabId: '1', materialName: 'Calacatta Gold', internalRef: 'CG-001', daysInStock: 120, listPrice: 1500 },
      { slabId: '2', materialName: 'Absolute Black', internalRef: 'AB-005', daysInStock: 45, listPrice: 800 },
      { slabId: '3', materialName: 'Carrara Marble', internalRef: 'CM-012', daysInStock: 15, listPrice: 1200 },
    ]
  };
};

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'supplierStats'],
    queryFn: getSupplierAnalytics,
  });

  if (isLoading || !data) {
    return <div className="flex h-full items-center justify-center"><SbSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <SbPageHeader title="Analytics" description="Sales performance and inventory health" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SbStatCard title="Total revenue (month)" value={`$${(data.totalRevenueMonth / 1000).toFixed(1)}k`} />
        <SbStatCard title="POs fulfilled" value={data.posFulfilled.toString()} />
        <SbStatCard title="Avg response time" value={`${data.avgResponseHrs.toFixed(1)}h`} />
        <SbStatCard title="Fulfillment rate" value={`${data.fulfillmentRate}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (Last 5 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={data.revenueByMonth} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <TopBuyersTable data={data.topBuyers} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryAgingTable data={data.inventoryAging} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
