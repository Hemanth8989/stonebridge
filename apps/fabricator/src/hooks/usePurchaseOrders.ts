import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  queryKeys,
  getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  acceptCounter,
  cancelPO,
  confirmPOReceived,
  raisePODispute,
} from '@sb/api-client';
import type { POFilters, CreatePODto } from '@sb/types';
import { useCartStore } from '../store/cartStore';

export function usePurchaseOrders(filters?: POFilters) {
  return useQuery({
    queryKey: queryKeys.pos.list(filters),
    queryFn: () => getPurchaseOrders(filters),
  });
}

export function usePurchaseOrder(id: string | null) {
  return useQuery({
    queryKey: queryKeys.pos.detail(id!),
    queryFn: () => getPurchaseOrder(id!),
    enabled: !!id,
  });
}

export function useCreatePO() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clear);

  return useMutation({
    mutationFn: (data: CreatePODto) => createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.slabs.all() });
      clearCart();
    },
  });
}

export function useAcceptCounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptCounter(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
    },
  });
}

export function useCancelPO() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelPO(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
    },
  });
}

export function useConfirmReceived() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmPOReceived(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
    },
  });
}

export function useRaiseDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { note: string; photos?: string[] } }) =>
      raisePODispute(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
    },
  });
}
