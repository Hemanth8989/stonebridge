import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Plus,
  Globe,
  Star,
  MapPin
} from 'lucide-react';
import { 
  Button, 
  SbSearchInput, 
  SbSpinner, 
  Tabs, 
  TabsList, 
  TabsTrigger,
  cn 
} from '@sb/ui';
import { useConnections, useSupplierDirectory, useRequestConnection } from '../hooks/useConnections';
import SupplierCard from '../components/suppliers/SupplierCard';

export default function SuppliersPage() {
  const [activeTab, setActiveTab] = useState('connected');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: connections, isLoading: connLoading } = useConnections();
  const { data: directory, isLoading: dirLoading } = useSupplierDirectory();
  const requestConnection = useRequestConnection();

  const handleRequest = (supplierId: string) => {
    requestConnection.mutate({ supplierId });
  };

  const filteredDirectory = directory?.data.filter(s => 
    s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.city && s.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.stateProvince && s.stateProvince.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const connectedSuppliers = filteredDirectory.filter(s => s.connection?.status === 'active');
  const pendingSuppliers = filteredDirectory.filter(s => s.connection?.status === 'pending');
  const availableSuppliers = filteredDirectory.filter(s => !s.connection);

  const displayList = activeTab === 'connected' ? connectedSuppliers : 
                      activeTab === 'pending' ? pendingSuppliers : 
                      availableSuppliers;

  const isLoading = connLoading || dirLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Supplier Network</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 italic">
            Connect with local and regional stone suppliers to access their live inventory.
          </p>
        </div>
      </div>

      {/* Network Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 leading-none mb-1">Active Partners</p>
            <p className="text-2xl font-black tracking-tighter text-primary">{connectedSuppliers.length}</p>
          </div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 leading-none mb-1">Pending Requests</p>
            <p className="text-2xl font-black tracking-tighter text-amber-500">{pendingSuppliers.length}</p>
          </div>
        </div>
        <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-lg">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-purple-500/60 leading-none mb-1">StoneBridge Network</p>
            <p className="text-2xl font-black tracking-tighter text-purple-500">{directory?.meta?.totalCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Discovery Area */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-muted/40 p-1 h-12 rounded-xl border border-border/20 shadow-inner">
              <TabsTrigger value="connected" className="rounded-lg px-6 h-9 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">My Suppliers</TabsTrigger>
              <TabsTrigger value="discover" className="rounded-lg px-6 h-9 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Discover New</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg px-6 h-9 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Pending</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <SbSearchInput 
              placeholder="Search by name or city..." 
              className="w-[280px] h-11 bg-card/50 border-border/50 shadow-sm"
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/50 bg-card/50">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 w-full items-center justify-center"><SbSpinner size="lg" /></div>
        ) : displayList.length === 0 ? (
          <div className="py-24 text-center bg-card/30 border border-dashed border-border/60 rounded-3xl">
            <div className="h-20 w-20 rounded-full bg-muted/40 flex items-center justify-center mb-6 mx-auto">
              <Building2 className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-black tracking-tight">No suppliers found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[300px] mx-auto italic">
              {activeTab === 'connected' ? "You haven't connected with any suppliers yet. Start discovering new ones!" : "Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayList.map((supplier) => (
              <SupplierCard 
                key={supplier.tenantId} 
                supplier={supplier} 
                onRequestConnection={handleRequest}
                isPending={requestConnection.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
