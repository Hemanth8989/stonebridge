import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button, SbPageHeader, SbSpinner, SbEmptyState } from '@sb/ui';
import SlabForm from '../components/inventory/SlabForm';
import { useSupplierSlabDetail } from '../hooks/useSupplierSlabs';

export default function InventoryEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: slabData, isLoading, isError } = useSupplierSlabDetail(id ?? null);
  const slab = slabData?.data;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><SbSpinner size="lg" /></div>;
  }

  if (isError || !slab) {
    return <SbEmptyState title="Error" description="Failed to load slab details." />;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <SbPageHeader
        title="Edit slab"
        description={slab.internalRef}
        actions={
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />
      <SlabForm
        mode="edit"
        defaultValues={slab}
        onSuccess={() => {
          navigate('/inventory');
        }}
      />
    </div>
  );
}
