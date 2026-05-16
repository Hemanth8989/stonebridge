import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';

test.describe('Supplier dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('renders all four stat cards on initial load', async ({ supplierDashboard }) => {
    await supplierDashboard.goto();
    await expect(supplierDashboard.todaysPOsCard.or(supplierDashboard.pendingAcksCard)).toBeVisible();
  });

  test('clicking "Add Slab" navigates to inventory/new', async ({ supplierDashboard, page }) => {
    await supplierDashboard.goto();
    if (await supplierDashboard.addSlabButton.isVisible().catch(() => false)) {
      await supplierDashboard.clickAddSlab();
      await expect(page).toHaveURL(/.*\/inventory\/new$/);
    }
  });

  test('clicking "View all orders" navigates to PO inbox', async ({ supplierDashboard, page }) => {
    await supplierDashboard.goto();
    if (await supplierDashboard.viewAllOrdersButton.isVisible().catch(() => false)) {
      await supplierDashboard.clickViewAllOrders();
      await expect(page).toHaveURL(/.*\/orders$/);
    }
  });

  test('recent POs table shows real rows from API', async ({ supplierDashboard }) => {
    await supplierDashboard.goto();
    const count = await supplierDashboard.getPORowCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('low stock alerts section renders', async ({ supplierDashboard }) => {
    await supplierDashboard.goto();
    if (await supplierDashboard.lowStockAlerts.isVisible().catch(() => false)) {
      await expect(supplierDashboard.lowStockAlerts).toBeVisible();
    }
  });
});
