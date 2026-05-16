import { create } from 'zustand';
import type { Notification } from '@sb/types';

interface NotifState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (n: Notification[]) => void;
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotifState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount });
  },
  addNotification: (notification) =>
    set((state) => {
      const notifications = [notification, ...state.notifications];
      return {
        notifications,
        unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
      };
    }),
  markRead: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (!notification || notification.isRead) return state;

      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
