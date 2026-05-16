import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import DashboardPage from '@/pages/DashboardPage';
import InventoryPage from '@/pages/InventoryPage';
import InventoryNewPage from '@/pages/InventoryNewPage';
import InventoryEditPage from '@/pages/InventoryEditPage';
import POInboxPage from '@/pages/POInboxPage';
import PODetailPage from '@/pages/PODetailPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ConnectionsPage from '@/pages/ConnectionsPage';
import SettingsPage from '@/pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/new" element={<InventoryNewPage />} />
          <Route path="/inventory/:id/edit" element={<InventoryEditPage />} />
          <Route path="/orders" element={<POInboxPage />} />
          <Route path="/orders/:id" element={<PODetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<div>Login form placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
