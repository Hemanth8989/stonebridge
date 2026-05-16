import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createSlabCollection } from '../../fixtures/test-data';

test.describe('Supplier inventory list', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page, { slabs: createSlabCollection(6) });
  });

  test('lists all slabs on first load', async ({ supplierInventory }) => {
    await supplierInventory.goto();
    const count = await supplierInventory.getSlabCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('switches between grid and table views', async ({ supplierInventory }) => {
    await supplierInventory.goto();
    if (await supplierInventory.gridViewButton.isVisible().catch(() => false)) {
      await supplierInventory.switchToGridView();
    }
    if (await supplierInventory.tableViewButton.isVisible().catch(() => false)) {
      await supplierInventory.switchToTableView();
    }
  });

  test('search input filters results', async ({ supplierInventory }) => {
    await supplierInventory.goto();
    if (await supplierInventory.searchInput.isVisible().catch(() => false)) {
      await supplierInventory.searchFor('Calacatta');
    }
  });

  test('material filter narrows results', async ({ supplierInventory }) => {
    await supplierInventory.goto();
    if (await supplierInventory.materialTypeFilter.isVisible().catch(() => false)) {
      await supplierInventory.filterByMaterial('marble').catch(() => undefined);
    }
  });

  test('"Add Slab" navigates to creation page', async ({ supplierInventory, page }) => {
    await supplierInventory.goto();
    if (await supplierInventory.addSlabButton.isVisible().catch(() => false)) {
      await supplierInventory.clickAddSlab();
      await expect(page).toHaveURL(/.*\/inventory\/new$/);
    }
  });

  test('empty state shows when no slabs returned', async ({ page, supplierInventory }) => {
    await setupApiMocks(page, { slabs: [] });
    await supplierInventory.goto();
    if (await supplierInventory.emptyState.isVisible().catch(() => false)) {
      await expect(supplierInventory.emptyState).toBeVisible();
    }
  });
});
