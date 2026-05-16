import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@sb/api-client';
import type { Notification } from '@sb/types';

interface SignalRCallbacks {
  onSlabStatusChange?: (slabId: string, status: string) => void;
  onPOStatusChange?: (poId: string, status: string) => void;
  onPriceChange?: (supplierId: string) => void;
}

export function useSignalR(callbacks: SignalRCallbacks = {}) {
  const { tenant } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const queryClient = useQueryClient();
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!tenant) return;

    const connect = async () => {
      const url = `${import.meta.env.VITE_WS_URL ?? 'ws://localhost:5001'}/hubs/stonebridge`;
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .withHubProtocol(new signalR.JsonHubProtocol())
        .build();

      connectionRef.current = connection;

      connection.on('SlabStatusChanged', (slabId: string, status: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.slabs.all() });
        if (callbacks.onSlabStatusChange) callbacks.onSlabStatusChange(slabId, status);
      });

      connection.on('POStatusChanged', (poId: string, status: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(poId) });
        if (callbacks.onPOStatusChange) callbacks.onPOStatusChange(poId, status);
      });

      connection.on('PriceChanged', (supplierId: string) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.slabs.all() });
        if (callbacks.onPriceChange) callbacks.onPriceChange(supplierId);
      });

      connection.on('Notification', (notification: Notification) => {
        addNotification(notification);
      });

      try {
        await connection.start();
        await connection.invoke('JoinGroup', `fabricator:${tenant.id}`);
      } catch (err) {
        console.error('SignalR Connection Error: ', err);
      }
    };

    connect();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [tenant, addNotification, queryClient, callbacks]);

  return connectionRef.current;
}
