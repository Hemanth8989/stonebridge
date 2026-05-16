import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { SbPageHeader, SbSpinner, SbEmptyState, Tabs, TabsList, TabsTrigger } from '@sb/ui';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import POCard from '../components/orders/POCard';
import type { POStatus } from '@sb/types';

export default function POInboxPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<POStatus | 'all'>('sent');
  const { data: posData, isLoading } = usePurchaseOrders();
  const pos = posData?.data || [];

  const tabs: Array<{ value: POStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'sent', label: 'Sent (Pending)' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'partially_acked', label: 'Partially Acked' },
    { value: 'countered', label: 'Countered' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
  ];

  const filteredPOs = activeTab === 'all' ? pos : pos.filter((po) => po.status === activeTab);

  const getTabCount = (tab: POStatus | 'all') => {
    if (tab === 'all') return pos.length;
    return pos.filter((po) => po.status === tab).length;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <SbPageHeader title="PO Inbox" description="Purchase orders from fabricators" />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as POStatus | 'all')} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-transparent border-b border-border rounded-none pb-0 h-auto">
          {tabs.map((tab) => {
            const count = getTabCount(tab.value);
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
              >
                {tab.label}
                {count > 0 && (
                  <span className="ml-2 bg-muted text-muted-foreground py-0.5 px-2 rounded-full text-xs">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <SbSpinner size="lg" />
          </div>
        ) : filteredPOs.length === 0 ? (
          <SbEmptyState
            icon={<Inbox className="w-8 h-8" />}
            title="No purchase orders"
            description="No orders match the selected status."
          />
        ) : (
          <div className="space-y-3 max-w-4xl">
            {filteredPOs.map((po) => (
              <POCard key={po.id} po={po} onClick={() => navigate(`/orders/${po.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
