import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getNotifications, markNotificationRead, markAllNotificationsRead } from '@sb/api-client';
import { useNotificationStore } from '../store/notificationStore';
import { useEffect } from 'react';

export function useNotifications() {
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const query = useQuery({
    queryKey: queryKeys.notifications.all(),
    queryFn: getNotifications,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data.data);
    }
  }, [query.data, setNotifications]);

  return query;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
}
