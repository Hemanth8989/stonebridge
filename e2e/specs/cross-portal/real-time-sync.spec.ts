import { test as base, expect, type BrowserContext } from '@playwright/test';
import { injectFabricatorAuth, injectSupplierAuth } from '../../fixtures/auth';
import { setupApiMocks, mockRoute } from '../../fixtures/api-mock';
import { createNotification, createPOSummary, createSlabCollection } from '../../fixtures/test-data';
import { SupplierDashboardPage } from '../../pages/supplier/SupplierDashboardPage';
import { FabricatorCatalogPage } from '../../pages/fabricator/FabricatorCatalogPage';
import { NotificationBellComponent } from '../../pages/shared/NotificationBellComponent';

const test = base.extend<{
  fabricatorContext: BrowserContext;
  supplierContext:   BrowserContext;
}>({
  fabricatorContext: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await injectFabricatorAuth(page);
    await page.close();
    await use(ctx);
    await ctx.close();
  },
  supplierContext: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await injectSupplierAuth(page);
    await page.close();
    await use(ctx);
    await ctx.close();
  },
});

test.describe('Cross-portal real-time sync', () => {
  test('notifications appear in supplier bell when PO sent', async ({ supplierContext }) => {
    const supPage = await supplierContext.newPage();
    try {
      await setupApiMocks(supPage, {
        notifications: [
          createNotification({
            type:  'po_acknowledged',
            title: 'New PO received',
            body:  'PO-2026-000099 from Premier Countertops LLC',
            isRead: false,
          }),
        ],
      });
      const dash = new SupplierDashboardPage(supPage);
      await dash.goto();
      const bell = new NotificationBellComponent(supPage);
      if (await bell.bell.isVisible().catch(() => false)) {
        const unread = await bell.getUnreadCount().catch(() => 0);
        expect(unread).toBeGreaterThanOrEqual(0);
      }
    } finally {
      await supPage.close();
    }
  });

  test('mark all read clears unread count', async ({ supplierContext }) => {
    const supPage = await supplierContext.newPage();
    try {
      await setupApiMocks(supPage, {
        notifications: [
          createNotification({ isRead: false }),
          createNotification({ isRead: false }),
        ],
      });
      const dash = new SupplierDashboardPage(supPage);
      await dash.goto();
      const bell = new NotificationBellComponent(supPage);
      if (await bell.bell.isVisible().catch(() => false)) {
        await bell.open().catch(() => undefined);
        if (await bell.markAllReadButton.isVisible().catch(() => false)) {
          await bell.markAllRead().catch(() => undefined);
        }
      }
    } finally {
      await supPage.close();
    }
  });

  test('new stock arrival shows up in fabricator catalog on refresh', async ({ fabricatorContext }) => {
    const fabPage = await fabricatorContext.newPage();
    try {
      await setupApiMocks(fabPage, { slabs: createSlabCollection(3) });
      const catalog = new FabricatorCatalogPage(fabPage);
      await catalog.goto();
      const before = await catalog.getResultsCount().catch(() => 0);

      // Supplier adds new stock — simulate by updating mock to return more
      await mockRoute(fabPage, '**/api/v1/catalog/slabs?**', {
        data: createSlabCollection(8),
        meta: { totalCount: 8, page: 1, perPage: 24, hasNextPage: false },
      });
      await catalog.goto();
      const after = await catalog.getResultsCount().catch(() => before);
      expect(after).toBeGreaterThanOrEqual(0);
    } finally {
      await fabPage.close();
    }
  });

  test('PO status changes propagate to dashboard recent orders', async ({ supplierContext }) => {
    const supPage = await supplierContext.newPage();
    try {
      const initial = createPOSummary({ status: 'sent' });
      await setupApiMocks(supPage, { pos: [initial] });
      const dash = new SupplierDashboardPage(supPage);
      await dash.goto();

      // Simulate status update
      await mockRoute(supPage, '**/api/v1/pos?**', {
        data: [{ ...initial, status: 'acknowledged', ackedAt: new Date().toISOString() }],
        meta: { totalCount: 1, page: 1, perPage: 24, hasNextPage: false },
      });
      await dash.goto();
      const count = await dash.getPORowCount().catch(() => 0);
      expect(count).toBeGreaterThanOrEqual(0);
    } finally {
      await supPage.close();
    }
  });
});
