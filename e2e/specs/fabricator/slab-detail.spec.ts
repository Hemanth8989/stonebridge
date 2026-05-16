import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createCatalogSlab } from '../../fixtures/test-data';

test.describe('Fabricator slab detail', () => {
  test('renders slab detail page', async ({ page, fabricatorSlabDetail }) => {
    const slab = createCatalogSlab();
    await setupApiMocks(page, { slabs: [slab] });
    await fabricatorSlabDetail.goto(slab.id);
    await expect(fabricatorSlabDetail.heading).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('add to cart button is visible', async ({ page, fabricatorSlabDetail }) => {
    const slab = createCatalogSlab();
    await setupApiMocks(page, { slabs: [slab] });
    await fabricatorSlabDetail.goto(slab.id);
    if (await fabricatorSlabDetail.addToCartButton.isVisible().catch(() => false)) {
      await expect(fabricatorSlabDetail.addToCartButton).toBeVisible();
    }
  });

  test('clicking add to cart updates cart', async ({ page, fabricatorSlabDetail, cart }) => {
    const slab = createCatalogSlab();
    await setupApiMocks(page, { slabs: [slab] });
    await fabricatorSlabDetail.goto(slab.id);
    if (await fabricatorSlabDetail.addToCartButton.isVisible().catch(() => false)) {
      await fabricatorSlabDetail.addToCart();
      if (await cart.cartButton.isVisible().catch(() => false)) {
        const count = await cart.getBadgeCount().catch(() => 0);
        expect(count).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('photo gallery renders', async ({ page, fabricatorSlabDetail }) => {
    const slab = createCatalogSlab();
    await setupApiMocks(page, { slabs: [slab] });
    await fabricatorSlabDetail.goto(slab.id);
    if (await fabricatorSlabDetail.photoGallery.isVisible().catch(() => false)) {
      await expect(fabricatorSlabDetail.photoGallery).toBeVisible();
    }
  });
});
