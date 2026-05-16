import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getConnections, getConnectionRequests, approveConnection, declineConnection } from '@sb/api-client';

export function useConnections() {
  return useQuery({
    queryKey: queryKeys.connections.all(),
    queryFn: getConnections,
  });
}

export function useConnectionRequests() {
  return useQuery({
    queryKey: queryKeys.connections.requests(),
    queryFn: getConnectionRequests,
  });
}

export function useApproveConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.requests() });
    },
  });
}

export function useDeclineConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => declineConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.requests() });
    },
  });
}
