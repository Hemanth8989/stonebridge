import type { Page, Locator } from '@playwright/test';

export class FabricatorProductsPage {
  readonly url = 'http://localhost:5173/products';

  readonly categoryFilter: Locator;
  readonly brandFilter:    Locator;
  readonly searchInput:    Locator;
  readonly productCards:   Locator;
  readonly emptyState:     Locator;

  constructor(private readonly page: Page) {
    this.categoryFilter = page.getByRole('combobox', { name: /category/i });
    this.brandFilter    = page.getByRole('combobox', { name: /brand/i });
    this.searchInput    = page.getByPlaceholder(/search/i);
    this.productCards   = page.locator('[data-testid="product-card"]');
    this.emptyState     = page.getByTestId('empty-state');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption(category);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByBrand(brand: string): Promise<void> {
    await this.brandFilter.selectOption(brand);
    await this.page.waitForLoadState('networkidle');
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }

  async addProductToCart(index: number, qty = 1): Promise<void> {
    const card = this.productCards.nth(index);
    const qtyInput = card.getByRole('spinbutton', { name: /qty|quantity/i });
    if (await qtyInput.count() > 0) await qtyInput.fill(String(qty));
    await card.getByRole('button', { name: /add to cart/i }).click();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
