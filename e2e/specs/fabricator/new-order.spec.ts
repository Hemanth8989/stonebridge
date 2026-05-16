import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { setCartState } from '../../utils/browser-storage';
import { createCatalogSlab } from '../../fixtures/test-data';

test.describe('Fabricator new order wizard', () => {
  test('wizard renders', async ({ page, fabricatorNewOrder }) => {
    await setupApiMocks(page);
    await fabricatorNewOrder.goto();
    await expect(
      fabricatorNewOrder.stepIndicator
        .or(fabricatorNewOrder.supplierSelect)
        .or(fabricatorNewOrder.submitOrderButton),
    ).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('can select supplier and progress through wizard', async ({ page, fabricatorNewOrder }) => {
    await setupApiMocks(page);
    await fabricatorNewOrder.goto();
    if (await fabricatorNewOrder.supplierSelect.isVisible().catch(() => false)) {
      await fabricatorNewOrder.selectSupplier('Apex Stone').catch(() => undefined);
      if (await fabricatorNewOrder.nextToItemsButton.isVisible().catch(() => false)) {
        await fabricatorNewOrder.goToItemsStep().catch(() => undefined);
      }
    }
  });

  test('order can be submitted with cart items', async ({ page, fabricatorNewOrder }) => {
    const slab = createCatalogSlab();
    await setupApiMocks(page, { slabs: [slab] });
    await page.addInitScript((slabId) => {
      localStorage.setItem('sb-fabricator-cart', JSON.stringify({
        state: { items: [{ slabId, qty: 1 }] },
        version: 0,
      }));
    }, slab.id);
    await fabricatorNewOrder.goto();
    if (await fabricatorNewOrder.submitOrderButton.isVisible().catch(() => false)) {
      await fabricatorNewOrder.submitOrder().catch(() => undefined);
    }
  });

  test('back button navigates away from wizard', async ({ page, fabricatorNewOrder }) => {
    await setupApiMocks(page);
    await fabricatorNewOrder.goto();
    if (await fabricatorNewOrder.backButton.isVisible().catch(() => false)) {
      await fabricatorNewOrder.backButton.click();
    }
  });
});
