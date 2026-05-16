import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import type { Notification, PurchaseOrder } from '@sb/types';

interface SignalRCallbacks {
  onNewPO?: (po: PurchaseOrder) => void;
  onConnectionRequest?: () => void;
}

export function useSignalR(callbacks: SignalRCallbacks = {}) {
  const { tenant } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
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

      connection.on('NewPO', (po: PurchaseOrder) => {
        if (callbacks.onNewPO) callbacks.onNewPO(po);
        addNotification({
          id: Math.random().toString(),
          tenantId: tenant.id,
          type: 'po_received' as any,
          title: 'New Purchase Order',
          body: `You received a new PO: ${po.poNumber}`,
          isRead: false,
          readAt: null,
          createdAt: new Date().toISOString(),
          linkUrl: `/orders/${po.id}`,
          userId: null,
          eventId: null,
          entityType: 'PurchaseOrder',
          entityId: po.id
        });
      });

      connection.on('ConnectionRequest', () => {
        if (callbacks.onConnectionRequest) callbacks.onConnectionRequest();
        addNotification({
          id: Math.random().toString(),
          tenantId: tenant.id,
          type: 'system' as any,
          title: 'New Connection Request',
          body: `A fabricator has requested to connect with you.`,
          isRead: false,
          readAt: null,
          createdAt: new Date().toISOString(),
          linkUrl: `/connections`,
          userId: null,
          eventId: null,
          entityType: 'Connection',
          entityId: null
        });
      });

      connection.on('Notification', (notification: Notification) => {
        addNotification(notification);
      });

      try {
        await connection.start();
        await connection.invoke('JoinGroup', `supplier:${tenant.id}`);
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
  }, [tenant, addNotification, callbacks]);

  return connectionRef.current;
}
