import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Inbox, BarChart3, Link2, Settings } from 'lucide-react';
import { cn } from '@sb/ui';
import { useNotificationStore } from '../store/notificationStore';
import NotificationBell from '../components/common/NotificationBell';
import UserMenu from '../components/common/UserMenu';

export default function AppLayout() {
  const { unreadCount } = useNotificationStore();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', to: '/inventory', icon: Package },
    { name: 'PO Inbox', to: '/orders', icon: Inbox, badge: unreadCount > 0 },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Connections', to: '/connections', icon: Link2 },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const item = navItems.find((i) => location.pathname.startsWith(i.to));
    return item ? item.name : 'Portal';
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-60 bg-card border-r border-border flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mr-3">
            S
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground leading-tight">StoneBridge</div>
            <div className="text-xs text-muted-foreground">Supplier portal</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2 rounded-md text-sm transition-colors group relative',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
                {item.badge && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-destructive" />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <UserMenu />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="font-semibold text-foreground">{getPageTitle()}</h2>
          <div className="flex items-center space-x-4">
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
