import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingCart, 
  Package, 
  ArrowRight,
  TrendingUp,
  Clock,
  History
} from 'lucide-react';
import { 
  Button, 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  SbSearchInput, 
  SbSpinner, 
  SbEmptyState,
  cn 
} from '@sb/ui';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import POCard from '../components/orders/POCard';
import type { POStatus } from '@sb/types';

const statusTabs: { value: string; label: string; count?: number }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'In Review' }, // sent, countered
  { value: 'active', label: 'Active' },    // acknowledged, confirmed, shipped
  { value: 'completed', label: 'Completed' }, // received, closed
  { value: 'disputed', label: 'Disputed' },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading } = usePurchaseOrders();

  const filteredPOs = data?.data.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          po.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && ['sent', 'countered'].includes(po.status);
    if (activeTab === 'active') return matchesSearch && ['acknowledged', 'confirmed', 'shipped'].includes(po.status);
    if (activeTab === 'completed') return matchesSearch && ['received', 'closed'].includes(po.status);
    if (activeTab === 'disputed') return matchesSearch && po.status === 'disputed';
    
    return matchesSearch;
  }) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">Purchase Orders</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 italic">
            Track and manage your material procurement from across all suppliers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 px-4 font-black uppercase tracking-widest text-[10px] border-border/50"
            onClick={() => navigate('/catalog')}
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Buy Materials
          </Button>
          <Button 
            size="sm" 
            className="h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg group"
            onClick={() => navigate('/orders/new')}
          >
            <ShoppingCart className="mr-2 h-3.5 w-3.5" />
            New Order
            <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-muted/40 p-1 h-12 rounded-xl border border-border/20 shadow-inner">
            {statusTabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="rounded-lg px-6 h-9 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <SbSearchInput 
            placeholder="PO # or Supplier..." 
            className="w-[240px] h-10 bg-card/50 border-border/50"
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-border/50">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <SbSpinner size="lg" />
        </div>
      ) : filteredPOs.length === 0 ? (
        <SbEmptyState
          icon={<Package className="h-10 w-10 text-muted-foreground/20" />}
          title="No purchase orders found"
          description="You haven't placed any orders matching these filters yet."
          className="py-24 bg-card/30 border border-dashed border-border/60 rounded-3xl"
          action={{
            label: "Show All Orders",
            onClick: () => { setActiveTab('all'); setSearchQuery(''); },
            variant: "outline"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPOs.map((po) => (
            <POCard key={po.id} po={po as any} />
          ))}
        </div>
      )}
    </div>
  );
}
