import { test as base, expect, type Page } from '@playwright/test';
import { SupplierDashboardPage } from '../pages/supplier/SupplierDashboardPage';
import { SupplierInventoryPage } from '../pages/supplier/SupplierInventoryPage';
import { SupplierInventoryNewPage } from '../pages/supplier/SupplierInventoryNewPage';
import { SupplierPOInboxPage } from '../pages/supplier/SupplierPOInboxPage';
import { SupplierPODetailPage } from '../pages/supplier/SupplierPODetailPage';
import { SupplierConnectionsPage } from '../pages/supplier/SupplierConnectionsPage';
import { SupplierAnalyticsPage } from '../pages/supplier/SupplierAnalyticsPage';
import { SupplierSettingsPage } from '../pages/supplier/SupplierSettingsPage';
import { FabricatorDashboardPage } from '../pages/fabricator/FabricatorDashboardPage';
import { FabricatorCatalogPage } from '../pages/fabricator/FabricatorCatalogPage';
import { FabricatorSlabDetailPage } from '../pages/fabricator/FabricatorSlabDetailPage';
import { FabricatorProductsPage } from '../pages/fabricator/FabricatorProductsPage';
import { FabricatorOrdersPage } from '../pages/fabricator/FabricatorOrdersPage';
import { FabricatorNewOrderPage } from '../pages/fabricator/FabricatorNewOrderPage';
import { FabricatorOrderDetailPage } from '../pages/fabricator/FabricatorOrderDetailPage';
import { FabricatorJobsPage } from '../pages/fabricator/FabricatorJobsPage';
import { FabricatorJobDetailPage } from '../pages/fabricator/FabricatorJobDetailPage';
import { FabricatorSuppliersPage } from '../pages/fabricator/FabricatorSuppliersPage';
import { FabricatorAnalyticsPage } from '../pages/fabricator/FabricatorAnalyticsPage';
import { NavigationComponent } from '../pages/shared/NavigationComponent';
import { NotificationBellComponent } from '../pages/shared/NotificationBellComponent';
import { CartComponent } from '../pages/shared/CartComponent';

type StoneBridgeFixtures = {
  supplierDashboard:     SupplierDashboardPage;
  supplierInventory:     SupplierInventoryPage;
  supplierInventoryNew:  SupplierInventoryNewPage;
  supplierPOInbox:       SupplierPOInboxPage;
  supplierPODetail:      SupplierPODetailPage;
  supplierConnections:   SupplierConnectionsPage;
  supplierAnalytics:     SupplierAnalyticsPage;
  supplierSettings:      SupplierSettingsPage;
  fabricatorDashboard:   FabricatorDashboardPage;
  fabricatorCatalog:     FabricatorCatalogPage;
  fabricatorSlabDetail:  FabricatorSlabDetailPage;
  fabricatorProducts:    FabricatorProductsPage;
  fabricatorOrders:      FabricatorOrdersPage;
  fabricatorNewOrder:    FabricatorNewOrderPage;
  fabricatorOrderDetail: FabricatorOrderDetailPage;
  fabricatorJobs:        FabricatorJobsPage;
  fabricatorJobDetail:   FabricatorJobDetailPage;
  fabricatorSuppliers:   FabricatorSuppliersPage;
  fabricatorAnalytics:   FabricatorAnalyticsPage;
  navigation:            NavigationComponent;
  notificationBell:      NotificationBellComponent;
  cart:                  CartComponent;
};

export const test = base.extend<StoneBridgeFixtures>({
  supplierDashboard:     async ({ page }, use) => { await use(new SupplierDashboardPage(page)); },
  supplierInventory:     async ({ page }, use) => { await use(new SupplierInventoryPage(page)); },
  supplierInventoryNew:  async ({ page }, use) => { await use(new SupplierInventoryNewPage(page)); },
  supplierPOInbox:       async ({ page }, use) => { await use(new SupplierPOInboxPage(page)); },
  supplierPODetail:      async ({ page }, use) => { await use(new SupplierPODetailPage(page)); },
  supplierConnections:   async ({ page }, use) => { await use(new SupplierConnectionsPage(page)); },
  supplierAnalytics:     async ({ page }, use) => { await use(new SupplierAnalyticsPage(page)); },
  supplierSettings:      async ({ page }, use) => { await use(new SupplierSettingsPage(page)); },
  fabricatorDashboard:   async ({ page }, use) => { await use(new FabricatorDashboardPage(page)); },
  fabricatorCatalog:     async ({ page }, use) => { await use(new FabricatorCatalogPage(page)); },
  fabricatorSlabDetail:  async ({ page }, use) => { await use(new FabricatorSlabDetailPage(page)); },
  fabricatorProducts:    async ({ page }, use) => { await use(new FabricatorProductsPage(page)); },
  fabricatorOrders:      async ({ page }, use) => { await use(new FabricatorOrdersPage(page)); },
  fabricatorNewOrder:    async ({ page }, use) => { await use(new FabricatorNewOrderPage(page)); },
  fabricatorOrderDetail: async ({ page }, use) => { await use(new FabricatorOrderDetailPage(page)); },
  fabricatorJobs:        async ({ page }, use) => { await use(new FabricatorJobsPage(page)); },
  fabricatorJobDetail:   async ({ page }, use) => { await use(new FabricatorJobDetailPage(page)); },
  fabricatorSuppliers:   async ({ page }, use) => { await use(new FabricatorSuppliersPage(page)); },
  fabricatorAnalytics:   async ({ page }, use) => { await use(new FabricatorAnalyticsPage(page)); },
  navigation:            async ({ page }, use) => { await use(new NavigationComponent(page)); },
  notificationBell:      async ({ page }, use) => { await use(new NotificationBellComponent(page)); },
  cart:                  async ({ page }, use) => { await use(new CartComponent(page)); },
});

export { expect };
export type { Page };
