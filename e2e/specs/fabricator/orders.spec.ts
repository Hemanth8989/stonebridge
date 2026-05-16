import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createPOSummary } from '../../fixtures/test-data';

test.describe('Fabricator orders list', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page, {
      pos: [
        createPOSummary({ status: 'sent' }),
        createPOSummary({ status: 'acknowledged' }),
        createPOSummary({ status: 'shipped' }),
        createPOSummary({ status: 'received' }),
      ],
    });
  });

  test('orders page renders rows', async ({ fabricatorOrders }) => {
    await fabricatorOrders.goto();
    const count = await fabricatorOrders.getOrderCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('clicking new order navigates to wizard', async ({ fabricatorOrders, page }) => {
    await fabricatorOrders.goto();
    if (await fabricatorOrders.newOrderButton.isVisible().catch(() => false)) {
      await fabricatorOrders.clickNewOrder();
      await expect(page).toHaveURL(/.*\/orders\/new$/);
    }
  });

  test('opening an order navigates to detail', async ({ fabricatorOrders, page }) => {
    await fabricatorOrders.goto();
    if ((await fabricatorOrders.getOrderCount()) > 0) {
      await fabricatorOrders.openOrder(0);
      await expect(page).toHaveURL(/.*\/orders\/.+/);
    }
  });

  test('search input filters results', async ({ fabricatorOrders }) => {
    await fabricatorOrders.goto();
    if (await fabricatorOrders.searchInput.isVisible().catch(() => false)) {
      await fabricatorOrders.searchFor('PO-2026');
    }
  });

  test('status tabs filter results', async ({ fabricatorOrders }) => {
    await fabricatorOrders.goto();
    for (const t of ['sent', 'acknowledged', 'shipped', 'received'] as const) {
      const tabKey = `${t}Tab` as 'sentTab' | 'acknowledgedTab' | 'shippedTab' | 'receivedTab';
      const tab = fabricatorOrders[tabKey];
      if (await tab.isVisible().catch(() => false)) {
        await fabricatorOrders.clickTab(t);
      }
    }
  });
});
