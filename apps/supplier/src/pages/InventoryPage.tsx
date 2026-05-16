import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, LayoutGrid, List } from 'lucide-react';
import { Button, SbPageHeader, SbSpinner, SbEmptyState, SbConfirmationDialog } from '@sb/ui';
import type { SlabStatus } from '@sb/types';
import { useSupplierSlabs, useDeleteSlab, useUpdateSlabStatus } from '@/hooks/useSupplierSlabs';
import SlabCard from '@/components/inventory/SlabCard';
import SlabTable from '@/components/inventory/SlabTable';
import InventoryFilters from '@/components/inventory/InventoryFilters';
import BulkUploadDialog from '@/components/inventory/BulkUploadDialog';

export default function InventoryPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [filters, setFilters] = useState({});
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: slabsData, isLoading } = useSupplierSlabs(filters);
  const slabs = slabsData?.data || [];
  const deleteSlabMutation = useDeleteSlab();
  const updateStatusMutation = useUpdateSlabStatus();

  const handleEdit = (id: string) => navigate(`/inventory/${id}/edit`);
  const handleStatusChange = (id: string, status: SlabStatus) => updateStatusMutation.mutate({ id, status });

  return (
    <div className="space-y-6 flex flex-col h-full">
      <SbPageHeader
        title="Inventory"
        description="Manage your slab and product catalog"
        actions={
          <>
            <Button variant="outline" onClick={() => setUploadOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button onClick={() => navigate('/inventory/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add slab
            </Button>
          </>
        }
      />

      <div className="flex items-center justify-between">
        <InventoryFilters filters={filters} onChange={setFilters} />
        <div className="flex items-center space-x-2 border border-border rounded-md p-1 ml-4 bg-card">
          <Button
            variant={view === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            className="px-2 h-8"
            onClick={() => setView('table')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={view === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            className="px-2 h-8"
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <SbSpinner size="lg" />
          </div>
        ) : slabs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <SbEmptyState
              icon={<LayoutGrid className="w-8 h-8" />}
              title="No slabs found"
              description="No inventory matches your current filters."
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-4">
            {view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {slabs.map((slab) => (
                  <SlabCard
                    key={slab.id}
                    slab={slab}
                    onEdit={handleEdit}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <SlabTable
                slabs={slabs}
                loading={isLoading}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                onDelete={(id) => setDeleteId(id)}
              />
            )}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>Showing {slabs.length} slabs</div>
            </div>
          </div>
        )}
      </div>

      <BulkUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />

      <SbConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Slab"
        description="Are you sure you want to delete this slab? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (deleteId) {
            deleteSlabMutation.mutate(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
