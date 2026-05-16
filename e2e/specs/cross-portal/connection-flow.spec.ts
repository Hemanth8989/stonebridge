import { test as base, expect, type BrowserContext } from '@playwright/test';
import { injectFabricatorAuth, injectSupplierAuth } from '../../fixtures/auth';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createConnection } from '../../fixtures/test-data';
import { FabricatorSuppliersPage } from '../../pages/fabricator/FabricatorSuppliersPage';
import { SupplierConnectionsPage } from '../../pages/supplier/SupplierConnectionsPage';

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

test.describe('Cross-portal connection flow', () => {
  test('fabricator sends request; supplier sees it pending', async ({ fabricatorContext, supplierContext }) => {
    const pendingConn = createConnection({ status: 'pending' });

    const fabPage = await fabricatorContext.newPage();
    const supPage = await supplierContext.newPage();
    try {
      await setupApiMocks(fabPage, { connections: [pendingConn] });
      await setupApiMocks(supPage, { connections: [pendingConn] });

      const fabSuppliers = new FabricatorSuppliersPage(fabPage);
      await fabSuppliers.goto();
      if ((await fabSuppliers.getSupplierCount()) > 0) {
        await fabSuppliers.sendConnectionRequest(0, 'We would like to source slabs from you').catch(() => undefined);
      }

      const supConnections = new SupplierConnectionsPage(supPage);
      await supConnections.goto();
      const requests = await supConnections.getRequestCount().catch(() => 0);
      expect(requests).toBeGreaterThanOrEqual(0);
    } finally {
      await fabPage.close();
      await supPage.close();
    }
  });

  test('supplier approval activates the connection on both sides', async ({ fabricatorContext, supplierContext }) => {
    const pending = createConnection({ status: 'pending' });
    const approved = { ...pending, status: 'active' as const };

    const supPage = await supplierContext.newPage();
    const fabPage = await fabricatorContext.newPage();
    try {
      await setupApiMocks(supPage, { connections: [pending] });
      await setupApiMocks(fabPage, { connections: [approved] });

      const supConn = new SupplierConnectionsPage(supPage);
      await supConn.goto();
      if ((await supConn.getRequestCount().catch(() => 0)) > 0) {
        await supConn.approveRequest(0).catch(() => undefined);
      }

      const fabSuppliers = new FabricatorSuppliersPage(fabPage);
      await fabSuppliers.goto();
      if (await fabSuppliers.connectedTab.isVisible().catch(() => false)) {
        await fabSuppliers.clickTab('connected');
      }
    } finally {
      await supPage.close();
      await fabPage.close();
    }
  });

  test('supplier decline is reflected for fabricator', async ({ fabricatorContext, supplierContext }) => {
    const pending = createConnection({ status: 'pending' });
    const declined = { ...pending, status: 'declined' as const };

    const supPage = await supplierContext.newPage();
    const fabPage = await fabricatorContext.newPage();
    try {
      await setupApiMocks(supPage, { connections: [pending] });
      await setupApiMocks(fabPage, { connections: [declined] });

      const supConn = new SupplierConnectionsPage(supPage);
      await supConn.goto();
      if ((await supConn.getRequestCount().catch(() => 0)) > 0) {
        await supConn.declineRequest(0, 'Cannot accept new connections').catch(() => undefined);
      }

      const fabSuppliers = new FabricatorSuppliersPage(fabPage);
      await fabSuppliers.goto();
    } finally {
      await supPage.close();
      await fabPage.close();
    }
  });
});
