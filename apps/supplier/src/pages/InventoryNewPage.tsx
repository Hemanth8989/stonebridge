import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button, SbPageHeader } from '@sb/ui';
import SlabForm from '../components/inventory/SlabForm';

export default function InventoryNewPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <SbPageHeader
        title="Add new slab"
        description="Add a slab to your inventory"
        actions={
          <Button variant="ghost" onClick={() => navigate('/inventory')}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />
      <SlabForm
        mode="create"
        onSuccess={() => {
          // Toast success here ideally
          navigate('/inventory');
        }}
      />
    </div>
  );
}
