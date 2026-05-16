import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  queryKeys,
  getPurchaseOrders,
  getPurchaseOrder,
  acknowledgePO,
  counterPO,
  cancelPO,
  markPOShipped,
} from '@sb/api-client';
import type { POFilters, AcknowledgePODto, CounterPODto } from '@sb/types';

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

export function useAcknowledgePO() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AcknowledgePODto }) =>
      acknowledgePO(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
    },
  });
}

export function useCounterPO() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CounterPODto }) => counterPO(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.list() });
    },
  });
}

export function useCancelPO() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelPO,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
    },
  });
}

export function useMarkShipped() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { trackingNumber?: string; carrier?: string };
    }) => markPOShipped(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pos.list() });
    },
  });
}
