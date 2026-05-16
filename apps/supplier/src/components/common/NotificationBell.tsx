import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button, Popover, PopoverTrigger, PopoverContent } from '@sb/ui';
import { cn } from '@sb/ui';
import { formatRelativeTime } from '@sb/utils';
import { useNotificationStore } from '../../store/notificationStore';
import { useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useNotifications';

export default function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount } = useNotificationStore();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif.id);
    }
    if (notif.linkUrl) {
      navigate(notif.linkUrl);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-medium text-destructive-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-medium text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.slice(0, 10).map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "px-4 py-3 text-sm cursor-pointer hover:bg-muted/50 border-b border-border last:border-0 transition-colors",
                    !notif.isRead && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                >
                  <div className="font-medium mb-1">{notif.title}</div>
                  <div className="text-muted-foreground line-clamp-2 text-xs mb-1">
                    {notif.body}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatRelativeTime(notif.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-2 border-t border-border bg-muted/20">
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => {}}>
            View all
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
