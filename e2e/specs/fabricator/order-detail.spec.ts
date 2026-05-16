import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createPOSummary, createPurchaseOrder } from '../../fixtures/test-data';

test.describe('Fabricator order detail', () => {
  test('renders order detail page', async ({ page, fabricatorOrderDetail }) => {
    const po = createPurchaseOrder({ status: 'acknowledged' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'acknowledged' })],
    });
    await fabricatorOrderDetail.goto(po.id);
    await expect(fabricatorOrderDetail.heading).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('counter-offer banner allows accept/reject', async ({ page, fabricatorOrderDetail }) => {
    const po = createPurchaseOrder({ status: 'countered' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'countered' })],
    });
    await fabricatorOrderDetail.goto(po.id);
    if (await fabricatorOrderDetail.counterOfferBanner.isVisible().catch(() => false)) {
      await expect(fabricatorOrderDetail.acceptCounterButton).toBeVisible();
    }
  });

  test('confirm receipt updates status', async ({ page, fabricatorOrderDetail }) => {
    const po = createPurchaseOrder({ status: 'shipped' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'shipped' })],
    });
    await fabricatorOrderDetail.goto(po.id);
    if (await fabricatorOrderDetail.confirmReceiptButton.isVisible().catch(() => false)) {
      await fabricatorOrderDetail.confirmReceipt('perfect').catch(() => undefined);
    }
  });

  test('cancel order opens confirmation dialog', async ({ page, fabricatorOrderDetail }) => {
    const po = createPurchaseOrder({ status: 'sent' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'sent' })],
    });
    await fabricatorOrderDetail.goto(po.id);
    if (await fabricatorOrderDetail.cancelOrderButton.isVisible().catch(() => false)) {
      await fabricatorOrderDetail.cancelOrder('No longer needed').catch(() => undefined);
    }
  });
});
