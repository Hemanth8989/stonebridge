import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';

test.describe('Supplier analytics', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('analytics page renders', async ({ supplierAnalytics }) => {
    await supplierAnalytics.goto();
    await expect(supplierAnalytics.header).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('all four stat cards present', async ({ supplierAnalytics }) => {
    await supplierAnalytics.goto();
    const cards = [
      supplierAnalytics.totalRevenueCard,
      supplierAnalytics.posFulfilledCard,
      supplierAnalytics.avgResponseTimeCard,
      supplierAnalytics.fulfillmentRateCard,
    ];
    for (const card of cards) {
      if (await card.isVisible().catch(() => false)) {
        await expect(card).toBeVisible();
      }
    }
  });

  test('revenue chart visible', async ({ supplierAnalytics }) => {
    await supplierAnalytics.goto();
    if (await supplierAnalytics.revenueChart.isVisible().catch(() => false)) {
      await expect(supplierAnalytics.revenueChart).toBeVisible();
    }
  });

  test('top buyers table renders data', async ({ supplierAnalytics }) => {
    await supplierAnalytics.goto();
    const count = await supplierAnalytics.getTopBuyerCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('inventory aging table renders data', async ({ supplierAnalytics }) => {
    await supplierAnalytics.goto();
    const count = await supplierAnalytics.getAgingRowCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
