import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, Package, DollarSign, Clock, Plus, Upload, List } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, SbPageHeader, SbStatCard, SbDataTable, POStatusBadge, SbEmptyState } from '@sb/ui';
import { formatCurrency, formatDate, formatRelativeTime, groupBy } from '@sb/utils';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useSupplierSlabs } from '../hooks/useSupplierSlabs';

export default function DashboardPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString(); // Simple today string
  
  // In a real app we'd pass { dateFrom: startOfDay } or similar to the API
  const { data: posData } = usePurchaseOrders();
  const { data: slabsData } = useSupplierSlabs();
  const pos = posData?.data || [];
  const slabs = slabsData?.data || [];

  const todaysPOs = pos.filter(po => po.sentAt && po.sentAt > new Date(new Date().setHours(0,0,0,0)).toISOString());
  const pendingAcks = pos.filter(po => po.status === 'sent');
  const availableSlabs = slabs.filter(slab => slab.status === 'available');
  
  // Mock monthly revenue for dashboard stat
  const monthlyRevenue = pos
    .filter(po => po.status === 'confirmed' || po.status === 'shipped')
    .reduce((sum, po) => sum + po.totalAmount, 0);

  const recentPOs = [...pos].sort((a, b) => new Date(b.sentAt || 0).getTime() - new Date(a.sentAt || 0).getTime()).slice(0, 10);

  // Group by material type to find low stock
  const byMaterial = groupBy(availableSlabs, (slab: any) => slab.materialName || 'Unknown');
  const lowStockAlerts = Object.entries(byMaterial)
    .filter(([_, groupSlabs]) => groupSlabs.length < 3)
    .map(([materialName, groupSlabs]) => ({ materialName, count: groupSlabs.length }));

  return (
    <div className="space-y-6">
      <SbPageHeader
        title="Dashboard"
        description={formatDate(today)}
        actions={
          <Button onClick={() => navigate('/inventory/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add slab
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SbStatCard
          title="Today's POs"
          value={todaysPOs.length.toString()}
          icon={<Inbox className="w-5 h-5" />}
          trend={{ value: 10, label: 'vs last month', direction: 'up' }}
        />
        <SbStatCard
          title="Pending acks"
          value={pendingAcks.length.toString()}
          icon={<Clock className="w-5 h-5" />}
        />
        <SbStatCard
          title="Available slabs"
          value={availableSlabs.length.toString()}
          icon={<Package className="w-5 h-5" />}
        />
        <SbStatCard
          title="Monthly revenue"
          value={formatCurrency(monthlyRevenue)}
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recent purchase orders</CardTitle>
              <Button variant="link" onClick={() => navigate('/orders')}>View all</Button>
            </CardHeader>
            <CardContent>
              {recentPOs.length > 0 ? (
                <SbDataTable
                  columns={[
                    {
                      key: 'poNumber',
                      header: 'PO Number',
                      render: (po) => (
                        <div className="font-mono text-sm text-primary hover:underline cursor-pointer" onClick={() => navigate(`/orders/${po.id}`)}>
                          {po.poNumber}
                        </div>
                      ),
                    },
                    {
                      key: 'fabricator',
                      header: 'Fabricator',
                      render: (po) => po.fabricatorName,
                    },
                    {
                      key: 'items',
                      header: 'Items',
                      render: (po: any) => po.totalLines || po.lineItems?.length || 0,
                    },
                    {
                      key: 'total',
                      header: 'Total',
                      render: (po) => formatCurrency(po.totalAmount),
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (po) => <POStatusBadge status={po.status} />,
                    },
                    {
                      key: 'sent',
                      header: 'Sent',
                      render: (po) => po.sentAt ? formatRelativeTime(po.sentAt) : '-',
                    },
                    {
                      key: 'actions',
                      header: 'Actions',
                      render: (po) => (
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/orders/${po.id}`)}>
                          View
                        </Button>
                      ),
                    },
                  ]}
                  keyExtractor={(po) => po.id}
                  data={recentPOs}
                />
              ) : (
                <SbEmptyState icon={<Inbox className="w-6 h-6" />} title="No recent orders" description="New purchase orders will appear here." />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Inventory alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockAlerts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockAlerts.map((alert) => (
                    <div key={alert.materialName} className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900">
                      <div>
                        <div className="font-medium text-sm">{alert.materialName}</div>
                        <div className="text-xs text-amber-600 dark:text-amber-400">Only {alert.count} in stock</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate('/inventory')}>View</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">No low stock alerts.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" onClick={() => navigate('/inventory/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Add new slab
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/inventory')}>
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/orders')}>
                <List className="w-4 h-4 mr-2" />
                View all orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
