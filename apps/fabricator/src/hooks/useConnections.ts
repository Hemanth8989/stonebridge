import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getConnections, getSupplierDirectory, requestConnection } from '@sb/api-client';

export function useConnections() {
  return useQuery({
    queryKey: queryKeys.connections.all(),
    queryFn: getConnections,
  });
}

export function useSupplierDirectory() {
  return useQuery({
    queryKey: queryKeys.connections.suppliers(),
    queryFn: getSupplierDirectory,
  });
}

export function useRequestConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ supplierId, message }: { supplierId: string; message?: string }) =>
      requestConnection(supplierId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all() });
    },
  });
}
