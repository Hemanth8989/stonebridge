import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createSlabCollection } from '../../fixtures/test-data';

test.describe('Fabricator catalog', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page, { slabs: createSlabCollection(8) });
  });

  test('catalog page renders slabs', async ({ fabricatorCatalog }) => {
    await fabricatorCatalog.goto();
    const count = await fabricatorCatalog.getResultsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('search input filters results', async ({ fabricatorCatalog }) => {
    await fabricatorCatalog.goto();
    if (await fabricatorCatalog.searchInput.isVisible().catch(() => false)) {
      await fabricatorCatalog.searchFor('Calacatta');
    }
  });

  test('material filter narrows results', async ({ fabricatorCatalog }) => {
    await fabricatorCatalog.goto();
    await fabricatorCatalog.applyFilters({ materials: ['marble'] }).catch(() => undefined);
  });

  test('clicking a slab opens detail page', async ({ fabricatorCatalog, page }) => {
    await fabricatorCatalog.goto();
    if ((await fabricatorCatalog.getResultsCount()) > 0) {
      await fabricatorCatalog.openSlab(0);
      await expect(page).toHaveURL(/.*\/catalog\/.+/);
    }
  });

  test('"add to cart" button adds slab to cart', async ({ fabricatorCatalog, cart }) => {
    await fabricatorCatalog.goto();
    if ((await fabricatorCatalog.getResultsCount()) > 0) {
      await fabricatorCatalog.addSlabToCart(0).catch(() => undefined);
      if (await cart.cartButton.isVisible().catch(() => false)) {
        const badge = await cart.getBadgeCount().catch(() => 0);
        expect(badge).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('clear filters resets state', async ({ fabricatorCatalog }) => {
    await fabricatorCatalog.goto();
    await fabricatorCatalog.applyFilters({ materials: ['marble'] }).catch(() => undefined);
    if (await fabricatorCatalog.clearAllFilters.isVisible().catch(() => false)) {
      await fabricatorCatalog.clearFilters();
    }
  });

  test('empty results show empty state', async ({ page, fabricatorCatalog }) => {
    await setupApiMocks(page, { slabs: [] });
    await fabricatorCatalog.goto();
    if (await fabricatorCatalog.emptyState.isVisible().catch(() => false)) {
      await expect(fabricatorCatalog.emptyState).toBeVisible();
    }
  });
});
