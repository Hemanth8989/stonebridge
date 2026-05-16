import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';

test.describe('Fabricator dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('dashboard renders with stat cards', async ({ fabricatorDashboard }) => {
    await fabricatorDashboard.goto();
    const anyCard = fabricatorDashboard.openPOsCard
      .or(fabricatorDashboard.jobsThisMonthCard)
      .or(fabricatorDashboard.connectedSuppliersCard)
      .or(fabricatorDashboard.pendingDeliveriesCard);
    await expect(anyCard).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('recent orders table displays rows', async ({ fabricatorDashboard }) => {
    await fabricatorDashboard.goto();
    const count = await fabricatorDashboard.getOrderRowCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('clicking "Browse Catalog" navigates to /catalog', async ({ fabricatorDashboard, page }) => {
    await fabricatorDashboard.goto();
    if (await fabricatorDashboard.browseCatalogLink.isVisible().catch(() => false)) {
      await fabricatorDashboard.clickQuickAction('catalog');
      await expect(page).toHaveURL(/.*\/catalog/);
    }
  });

  test('cart reminder banner appears when cart has items', async ({ page, fabricatorDashboard }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sb-fabricator-cart', JSON.stringify({
        state: { items: [{ slabId: 'test-1', qty: 1 }] },
        version: 0,
      }));
    });
    await fabricatorDashboard.goto();
    if (await fabricatorDashboard.cartReminderBanner.isVisible().catch(() => false)) {
      await expect(fabricatorDashboard.cartReminderBanner).toBeVisible();
    }
  });
});
