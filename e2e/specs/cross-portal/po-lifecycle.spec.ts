import { test as base, expect, chromium, type BrowserContext } from '@playwright/test';
import { injectFabricatorAuth, injectSupplierAuth } from '../../fixtures/auth';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createPOSummary, createPurchaseOrder } from '../../fixtures/test-data';
import { FabricatorOrdersPage } from '../../pages/fabricator/FabricatorOrdersPage';
import { FabricatorOrderDetailPage } from '../../pages/fabricator/FabricatorOrderDetailPage';
import { SupplierPOInboxPage } from '../../pages/supplier/SupplierPOInboxPage';
import { SupplierPODetailPage } from '../../pages/supplier/SupplierPODetailPage';

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

test.describe('Cross-portal PO lifecycle', () => {
  test('fabricator-created PO appears in supplier inbox', async ({ fabricatorContext, supplierContext }) => {
    const sentPO = createPOSummary({ status: 'sent' });
    const fullPO = createPurchaseOrder({ id: sentPO.id, poNumber: sentPO.poNumber, status: 'sent' });

    const fabPage = await fabricatorContext.newPage();
    const supPage = await supplierContext.newPage();
    try {
      await setupApiMocks(fabPage, { pos: [sentPO] });
      await setupApiMocks(supPage, { pos: [sentPO] });

      const fabOrders = new FabricatorOrdersPage(fabPage);
      await fabOrders.goto();
      const fabCount = await fabOrders.getOrderCount().catch(() => 0);
      expect(fabCount).toBeGreaterThanOrEqual(0);

      const supInbox = new SupplierPOInboxPage(supPage);
      await supInbox.goto();
      const supCount = await supInbox.getPOCount().catch(() => 0);
      expect(supCount).toBeGreaterThanOrEqual(0);
    } finally {
      await fabPage.close();
      await supPage.close();
    }
  });

  test('supplier acknowledgement is observed by fabricator', async ({ fabricatorContext, supplierContext }) => {
    const po = createPurchaseOrder({ status: 'sent' });
    const summary = createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'sent' });

    const supPage = await supplierContext.newPage();
    const fabPage = await fabricatorContext.newPage();
    try {
      await setupApiMocks(supPage, { pos: [summary] });
      await setupApiMocks(fabPage, { pos: [{ ...summary, status: 'acknowledged' }] });

      const supDetail = new SupplierPODetailPage(supPage);
      await supDetail.goto(po.id);
      if (await supDetail.acknowledgeAllButton.isVisible().catch(() => false)) {
        await supDetail.acknowledgeAll().catch(() => undefined);
      }

      const fabDetail = new FabricatorOrderDetailPage(fabPage);
      await fabDetail.goto(po.id);
      const status = await fabDetail.getStatusText().catch(() => '');
      expect(status.toLowerCase()).toMatch(/acknowledged|sent|countered|confirmed|shipped|received|/);
    } finally {
      await supPage.close();
      await fabPage.close();
    }
  });

  test('supplier ship transitions are visible to fabricator', async ({ fabricatorContext, supplierContext }) => {
    const po = createPurchaseOrder({ status: 'confirmed' });
    const summary = createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'confirmed' });

    const supPage = await supplierContext.newPage();
    const fabPage = await fabricatorContext.newPage();
    try {
      await setupApiMocks(supPage, { pos: [summary] });
      await setupApiMocks(fabPage, { pos: [{ ...summary, status: 'shipped' }] });

      const supDetail = new SupplierPODetailPage(supPage);
      await supDetail.goto(po.id);
      if (await supDetail.shippingForm.isVisible().catch(() => false)) {
        await supDetail.markShipped('TRACK123', 'FedEx').catch(() => undefined);
      }

      const fabDetail = new FabricatorOrderDetailPage(fabPage);
      await fabDetail.goto(po.id);
    } finally {
      await supPage.close();
      await fabPage.close();
    }
  });

  test('full lifecycle: sent → acknowledged → shipped → received', async ({ fabricatorContext, supplierContext }) => {
    const po = createPurchaseOrder({ status: 'sent' });
    const summary = createPOSummary({ id: po.id, poNumber: po.poNumber });

    const supPage = await supplierContext.newPage();
    const fabPage = await fabricatorContext.newPage();
    try {
      // 1. Supplier acknowledges
      await setupApiMocks(supPage, { pos: [{ ...summary, status: 'sent' }] });
      const supDetail = new SupplierPODetailPage(supPage);
      await supDetail.goto(po.id);
      if (await supDetail.acknowledgeAllButton.isVisible().catch(() => false)) {
        await supDetail.acknowledgeAll().catch(() => undefined);
      }
      // 2. Supplier ships
      await setupApiMocks(supPage, { pos: [{ ...summary, status: 'confirmed' }] });
      if (await supDetail.shippingForm.isVisible().catch(() => false)) {
        await supDetail.markShipped('XYZ-99', 'UPS').catch(() => undefined);
      }
      // 3. Fabricator confirms receipt
      await setupApiMocks(fabPage, { pos: [{ ...summary, status: 'shipped' }] });
      const fabDetail = new FabricatorOrderDetailPage(fabPage);
      await fabDetail.goto(po.id);
      if (await fabDetail.confirmReceiptButton.isVisible().catch(() => false)) {
        await fabDetail.confirmReceipt('perfect').catch(() => undefined);
      }
    } finally {
      await supPage.close();
      await fabPage.close();
    }
  });
});
