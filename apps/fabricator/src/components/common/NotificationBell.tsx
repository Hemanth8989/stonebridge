import React from 'react';
import { Bell, CheckCircle2, XCircle, AlertTriangle, TrendingUp, Plus, Clock, Package, Link2 } from 'lucide-react';
import { Button, Popover, PopoverTrigger, PopoverContent, cn } from '@sb/ui';
import { formatRelativeTime } from '@sb/utils';
import { useNotificationStore } from '../../store/notificationStore';
import { useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useNotifications';

const iconMap: Record<string, any> = {
  po_acknowledged: CheckCircle2,
  po_declined: XCircle,
  po_countered: AlertTriangle,
  price_changed: TrendingUp,
  new_stock: Plus,
  po_unacked_24h: Clock,
  delivery_confirmed: Package,
  connection_approved: Link2,
};

const colorMap: Record<string, string> = {
  po_acknowledged: 'text-green-500',
  po_declined: 'text-red-500',
  po_countered: 'text-amber-500',
  price_changed: 'text-blue-500',
  new_stock: 'text-purple-500',
  po_unacked_24h: 'text-orange-500',
  delivery_confirmed: 'text-green-500',
  connection_approved: 'text-emerald-500',
};

export default function NotificationBell() {
  const { notifications, unreadCount } = useNotificationStore();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm" className="h-auto px-1 text-xs" onClick={() => markAllRead()}>
            Mark all read
          </Button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((n) => {
              const Icon = iconMap[n.type] || Bell;
              return (
                <div
                  key={n.id}
                  className={cn(
                    'flex cursor-pointer gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50',
                    !n.isRead && 'bg-accent/30'
                  )}
                  onClick={() => !n.isRead && markRead(n.id)}
                >
                  <div className={cn('mt-0.5 rounded-full p-1.5 bg-background shadow-sm', colorMap[n.type])}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-semibold leading-none">{n.title}</p>
                    <p className="text-[11px] leading-tight text-muted-foreground line-clamp-2">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 font-medium">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
