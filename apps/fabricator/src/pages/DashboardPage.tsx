import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingCart, 
  Briefcase, 
  Building2, 
  Plus, 
  ChevronRight,
  Clock,
  Layers,
  ArrowUpRight,
  Package
} from 'lucide-react';
import { 
  SbStatCard, 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  SbAvatar,
  POStatusBadge,
  cn 
} from '@sb/ui';
import { formatCurrency, formatRelativeTime } from '@sb/utils';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useJobs } from '../hooks/useJobs';
import { useCatalogSlabs } from '../hooks/useCatalogSlabs';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: posData } = usePurchaseOrders({ perPage: 5 });
  const { data: jobsData } = useJobs();
  const { data: slabsData } = useCatalogSlabs({ perPage: 8 });

  const activeJobsCount = jobsData?.data.filter(j => 
    ['approved', 'templated', 'fabricating', 'ready'].includes(j.status)
  ).length || 0;

  const pendingPOCount = posData?.data.filter(po => 
    ['sent', 'countered'].includes(po.status)
  ).length || 0;

  const stats = [
    { 
      title: 'Active Jobs', 
      value: activeJobsCount, 
      icon: <Briefcase className="h-4 w-4 text-primary" />,
      trend: { value: 12, label: 'vs last month', direction: 'up' as const } 
    },
    { 
      title: 'Pending POs', 
      value: pendingPOCount, 
      icon: <ShoppingCart className="h-4 w-4 text-amber-500" />,
      trend: { value: 4, label: 'requires action', direction: 'up' as const } 
    },
    { 
      title: 'Total Spend (MTD)', 
      value: formatCurrency(145820), 
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      trend: { value: 8, label: 'vs last month', direction: 'down' as const } 
    },
    { 
      title: 'New Slabs (24h)', 
      value: slabsData?.meta?.totalCount || 0, 
      icon: <Layers className="h-4 w-4 text-purple-500" /> 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Overview</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 italic">
            Welcome back! Here is what's happening at your shop today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 px-4 font-black uppercase tracking-widest text-[10px] border-border/50"
            onClick={() => navigate('/jobs/new')}
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            New Job
          </Button>
          <Button 
            size="sm" 
            className="h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg"
            onClick={() => navigate('/catalog')}
          >
            <ShoppingCart className="mr-2 h-3.5 w-3.5" />
            Order Materials
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <SbStatCard key={i} {...stat} className="border-border/50 shadow-sm" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Purchase Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Recent Purchase Orders
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] font-black uppercase tracking-widest text-primary"
              onClick={() => navigate('/orders')}
            >
              View All
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {posData?.data.slice(0, 4).map((po) => (
              <Card 
                key={po.id} 
                className="overflow-hidden border-border/40 bg-card/50 hover:bg-card hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/orders/${po.id}`)}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center font-mono text-xs font-black text-muted-foreground">
                    #{po.poNumber.slice(-4)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black truncate group-hover:text-primary transition-colors">
                      {po.supplierName}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground">
                      {po.totalLines} items · {formatCurrency(po.totalAmount)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <POStatusBadge status={po.status} />
                    <span className="text-[9px] font-bold text-muted-foreground/60 italic">
                      {formatRelativeTime(po.createdAt)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* New Inventory Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              New in Catalog
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] font-black uppercase tracking-widest text-primary"
              onClick={() => navigate('/catalog')}
            >
              Marketplace
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {slabsData?.data.slice(0, 5).map((slab) => (
              <div 
                key={slab.id} 
                className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-border/60 hover:bg-muted/30 transition-all cursor-pointer group"
                onClick={() => navigate(`/catalog/${slab.id}`)}
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted border border-border/40 shadow-sm">
                  {slab.primaryPhotoUrl ? (
                    <img src={slab.primaryPhotoUrl} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="" />
                  ) : (
                    <Layers className="h-6 w-6 text-muted-foreground/20 m-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate group-hover:text-primary transition-colors uppercase tracking-tight">
                    {slab.materialName}
                  </p>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    {slab.colorFamily} · {slab.finish}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-black text-primary">{formatCurrency(slab.listPrice || 0)}</span>
                    <span className="text-[9px] font-bold text-muted-foreground italic">{slab.supplierName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
