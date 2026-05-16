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
  const markReadLocal = useNotificationStore((state) => state.markRead);
  
  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: (id) => {
      markReadLocal(id);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const markAllReadLocal = useNotificationStore((state) => state.markAllRead);

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: () => {
      markAllReadLocal();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
}
