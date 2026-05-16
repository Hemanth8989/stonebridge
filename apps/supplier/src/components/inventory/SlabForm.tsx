import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button, Checkbox, Textarea, Card, CardContent, SbSpinner } from '@sb/ui';
import type { Slab } from '@sb/types';
import { useCreateSlab, useUpdateSlab } from '../../hooks/useSupplierSlabs';

const slabSchema = z.object({
  materialType: z.string().min(1, 'Required'),
  materialName: z.string().min(1, 'Required'),
  colorFamily: z.string().optional(),
  pattern: z.string().optional(),
  originCountry: z.string().optional(),
  quarryName: z.string().optional(),
  lotNumber: z.string().optional(),
  blockNumber: z.string().optional(),
  thicknessCm: z.coerce.number().min(0.5).max(10),
  finish: z.string().min(1, 'Required'),
  grossLengthMm: z.coerce.number().min(100),
  grossWidthMm: z.coerce.number().min(100),
  weightKg: z.coerce.number().optional(),
  qualityGrade: z.string().optional(),
  priceOverride: z.coerce.number().optional(),
  rackLocation: z.string().optional(),
  warehouseId: z.string().optional(),
  isRemnant: z.boolean().default(false),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof slabSchema>;

interface SlabFormProps {
  defaultValues?: Partial<Slab> & { notes?: string };
  onSuccess: (slab: Slab) => void;
  mode: 'create' | 'edit';
}

export default function SlabForm({ defaultValues, onSuccess, mode }: SlabFormProps) {
  const createMutation = useCreateSlab();
  const updateMutation = useUpdateSlab();

  const form = useForm<FormData>({
    resolver: zodResolver(slabSchema),
    defaultValues: {
      materialType: defaultValues?.materialType || '',
      materialName: defaultValues?.materialName || '',
      colorFamily: defaultValues?.colorFamily || '',
      pattern: defaultValues?.pattern || '',
      originCountry: defaultValues?.originCountry || '',
      quarryName: defaultValues?.quarryName || '',
      lotNumber: defaultValues?.lotNumber || '',
      blockNumber: defaultValues?.blockNumber || '',
      thicknessCm: defaultValues?.thicknessCm || 3,
      finish: defaultValues?.finish || 'polished',
      grossLengthMm: defaultValues?.grossLengthMm || 3000,
      grossWidthMm: defaultValues?.grossWidthMm || 1500,
      weightKg: defaultValues?.weightKg || 0,
      qualityGrade: defaultValues?.qualityGrade || '',
      priceOverride: defaultValues?.priceOverride || 0,
      rackLocation: defaultValues?.rackLocation || '',
      warehouseId: defaultValues?.warehouseId || '',
      isRemnant: defaultValues?.isRemnant || false,
      notes: defaultValues?.notes || '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (mode === 'create') {
      createMutation.mutate(data as any, { onSuccess: (res) => onSuccess(res.data) });
    } else if (defaultValues?.id) {
      updateMutation.mutate({ id: defaultValues.id, data: data as any }, { onSuccess: (res) => onSuccess(res.data) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg mb-2">Material Identity</h3>
              
              <FormField control={form.control} name="materialType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="granite">Granite</SelectItem>
                      <SelectItem value="marble">Marble</SelectItem>
                      <SelectItem value="quartzite">Quartzite</SelectItem>
                      <SelectItem value="quartz">Quartz</SelectItem>
                      <SelectItem value="porcelain">Porcelain</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="materialName" render={({ field }) => (
                <FormItem><FormLabel>Material Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="colorFamily" render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Family</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['white', 'black', 'gray', 'brown', 'blue', 'green', 'red', 'cream', 'beige'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="pattern" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pattern</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select pattern" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['solid', 'veined', 'bookmatched', 'flecked', 'exotic'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-2">
                <FormField control={form.control} name="originCountry" render={({ field }) => <FormItem><FormLabel>Origin Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="quarryName" render={({ field }) => <FormItem><FormLabel>Quarry</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="lotNumber" render={({ field }) => <FormItem><FormLabel>Lot #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="blockNumber" render={({ field }) => <FormItem><FormLabel>Block #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg mb-2">Physical Attributes</h3>

              <div className="grid grid-cols-2 gap-2">
                <FormField control={form.control} name="thicknessCm" render={({ field }) => <FormItem><FormLabel>Thickness (cm)</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="finish" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finish</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select finish" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {['polished', 'honed', 'leathered', 'brushed'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="grossLengthMm" render={({ field }) => <FormItem><FormLabel>Length (mm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="grossWidthMm" render={({ field }) => <FormItem><FormLabel>Width (mm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="weightKg" render={({ field }) => <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="qualityGrade" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quality Grade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {['A', 'B', 'C'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="priceOverride" render={({ field }) => <FormItem><FormLabel>Price/sqft ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="rackLocation" render={({ field }) => <FormItem><FormLabel>Rack Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField control={form.control} name="warehouseId" render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <FormControl><Input placeholder="Main Hub" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="isRemnant" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none"><FormLabel>This is a remnant slab</FormLabel></div>
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div>
              <FormLabel className="block mb-2">Photos</FormLabel>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mb-2 opacity-50" />
                <div className="text-sm font-medium">Click to upload photos</div>
                <div className="text-xs">JPG, PNG up to 10MB</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <SbSpinner className="mr-2" size="sm" />}
            {mode === 'create' ? 'Add slab' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
