import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  queryKeys,
  getSupplierSlabs,
  getSupplierSlabDetail,
  createSlab,
  updateSlab,
  updateSlabStatus,
  deleteSlab,
} from '@sb/api-client';
import type { CreateSlabDto, SlabStatus } from '@sb/types';

export function useSupplierSlabs(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.supplierSlabs.list(filters),
    queryFn: () => getSupplierSlabs(filters),
  });
}

export function useSupplierSlabDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.supplierSlabs.detail(id!),
    queryFn: () => getSupplierSlabDetail(id!),
    enabled: !!id,
  });
}

export function useCreateSlab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSlab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.all() });
    },
  });
}

export function useUpdateSlab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSlabDto> }) =>
      updateSlab(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.detail(id) });
    },
  });
}

export function useUpdateSlabStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SlabStatus }) =>
      updateSlabStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.detail(id) });
    },
  });
}

export function useDeleteSlab() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSlab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.list() });
    },
  });
}
