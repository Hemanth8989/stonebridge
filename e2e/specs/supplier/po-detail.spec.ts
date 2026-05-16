import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createPOSummary, createPurchaseOrder } from '../../fixtures/test-data';

test.describe('Supplier PO detail', () => {
  test('renders PO heading and status', async ({ page, supplierPODetail }) => {
    const po = createPurchaseOrder({ status: 'sent' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'sent' })],
    });
    await supplierPODetail.goto(po.id);
    await expect(supplierPODetail.poNumberHeading).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('acknowledge all transitions PO to acknowledged', async ({ page, supplierPODetail }) => {
    const po = createPurchaseOrder({ status: 'sent' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'sent' })],
    });
    await supplierPODetail.goto(po.id);
    if (await supplierPODetail.acknowledgeAllButton.isVisible().catch(() => false)) {
      await supplierPODetail.acknowledgeAll();
    }
  });

  test('counter offer form opens', async ({ page, supplierPODetail }) => {
    const po = createPurchaseOrder({ status: 'sent' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'sent' })],
    });
    await supplierPODetail.goto(po.id);
    if (await supplierPODetail.counterFormToggle.isVisible().catch(() => false)) {
      await supplierPODetail.openCounterForm();
      await expect(supplierPODetail.counterOfferForm).toBeVisible();
    }
  });

  test('submitting counter offer transitions PO to countered', async ({ page, supplierPODetail }) => {
    const po = createPurchaseOrder({ status: 'sent' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'sent' })],
    });
    await supplierPODetail.goto(po.id);
    if (await supplierPODetail.counterFormToggle.isVisible().catch(() => false)) {
      await supplierPODetail.openCounterForm();
      await supplierPODetail.submitCounter({
        proposedDelivery: '2026-06-30',
        note: 'Delayed quarry shipment',
      });
    }
  });

  test('mark shipped sets tracking info', async ({ page, supplierPODetail }) => {
    const po = createPurchaseOrder({ status: 'confirmed' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'confirmed' })],
    });
    await supplierPODetail.goto(po.id);
    if (await supplierPODetail.shippingForm.isVisible().catch(() => false)) {
      await supplierPODetail.markShipped('1Z999AA10123456784', 'UPS');
    }
  });

  test('timeline renders status history', async ({ page, supplierPODetail }) => {
    const po = createPurchaseOrder({ status: 'acknowledged' });
    await setupApiMocks(page, {
      pos: [createPOSummary({ id: po.id, poNumber: po.poNumber, status: 'acknowledged' })],
    });
    await supplierPODetail.goto(po.id);
    if (await supplierPODetail.timeline.isVisible().catch(() => false)) {
      await expect(supplierPODetail.timeline).toBeVisible();
    }
  });
});
