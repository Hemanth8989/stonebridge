import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Package,
  ShoppingCart,
  Briefcase,
  Building2,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@sb/ui';
import { useCartStore } from '../store/cartStore';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import NotificationBell from '../components/common/NotificationBell';
import UserMenu from '../components/common/UserMenu';
import CartButton from '../components/common/CartButton';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Layers, label: 'Catalog', path: '/catalog' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: ShoppingCart, label: 'My Orders', path: '/orders', type: 'orders' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: Building2, label: 'Suppliers', path: '/suppliers' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function AppLayout() {
  const location = useLocation();
  const cartItemCount = useCartStore((state) => state.totalItems());
  const { data: posData } = usePurchaseOrders();
  
  const pendingPOCount = posData?.data.filter(po => 
    po.status === 'sent' || po.status === 'countered'
  ).length || 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-border bg-card">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg mr-3">
              <span className="text-xl font-bold">S</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight text-foreground">StoneBridge</h1>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Fabricator portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium shadow-sm'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )
                }
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </div>
                <div className="flex items-center gap-1">
                  {item.type === 'orders' && cartItemCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in fade-in zoom-in duration-300">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                  {item.type === 'orders' && pendingPOCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                      {pendingPOCount}
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-border p-4">
            <UserMenu />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col pl-60 overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center">
            <nav className="flex text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>Portal</li>
                <li className="flex items-center space-x-2">
                  <span className="text-border">/</span>
                  <span className="text-foreground capitalize">{location.pathname.split('/')[1] || 'Dashboard'}</span>
                </li>
              </ol>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <CartButton />
            <NotificationBell />
            <div className="h-8 w-[1px] bg-border mx-2" />
            <UserMenu hideName />
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto bg-background p-6 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
