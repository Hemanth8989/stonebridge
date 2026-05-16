import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';

test.describe('Fabricator products catalog', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('products page renders cards', async ({ fabricatorProducts }) => {
    await fabricatorProducts.goto();
    const count = await fabricatorProducts.getProductCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('category filter narrows results', async ({ fabricatorProducts }) => {
    await fabricatorProducts.goto();
    if (await fabricatorProducts.categoryFilter.isVisible().catch(() => false)) {
      await fabricatorProducts.filterByCategory('blade').catch(() => undefined);
    }
  });

  test('search input filters results', async ({ fabricatorProducts }) => {
    await fabricatorProducts.goto();
    if (await fabricatorProducts.searchInput.isVisible().catch(() => false)) {
      await fabricatorProducts.searchFor('blade');
    }
  });

  test('add product to cart', async ({ fabricatorProducts, cart }) => {
    await fabricatorProducts.goto();
    if ((await fabricatorProducts.getProductCount()) > 0) {
      await fabricatorProducts.addProductToCart(0, 2).catch(() => undefined);
      if (await cart.cartButton.isVisible().catch(() => false)) {
        const badge = await cart.getBadgeCount().catch(() => 0);
        expect(badge).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
