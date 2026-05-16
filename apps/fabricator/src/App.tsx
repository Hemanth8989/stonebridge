import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import CatalogPage from './pages/CatalogPage';
import SlabDetailPage from './pages/SlabDetailPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import NewOrderPage from './pages/NewOrderPage';
import OrderDetailPage from './pages/OrderDetailPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import SuppliersPage from './pages/SuppliersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:slabId" element={<SlabDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<NewOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<div>Login form placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
