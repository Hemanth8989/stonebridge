import type { Page, Locator } from '@playwright/test';

export class CartComponent {
  readonly cartButton:     Locator;
  readonly cartBadge:      Locator;
  readonly drawer:         Locator;
  readonly itemRows:       Locator;
  readonly subtotal:       Locator;
  readonly checkoutButton: Locator;
  readonly emptyState:     Locator;

  constructor(private readonly page: Page) {
    this.cartButton     = page.getByRole('button', { name: /cart/i });
    this.cartBadge      = this.cartButton.getByTestId('cart-badge');
    this.drawer         = page.getByTestId('cart-drawer');
    this.itemRows       = page.locator('[data-testid="cart-item"]');
    this.subtotal       = page.getByTestId('cart-subtotal');
    this.checkoutButton = this.drawer.getByRole('button', { name: /checkout|create order|proceed/i });
    this.emptyState     = this.drawer.getByTestId('empty-state');
  }

  async open(): Promise<void> {
    await this.cartButton.click();
    await this.drawer.waitFor({ state: 'visible' });
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.drawer.waitFor({ state: 'hidden' }).catch(() => undefined);
  }

  async getItemCount(): Promise<number> {
    return this.itemRows.count();
  }

  async getBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible().catch(() => false))) return 0;
    const text = (await this.cartBadge.textContent())?.trim() ?? '0';
    return parseInt(text, 10) || 0;
  }

  async removeItem(index: number): Promise<void> {
    await this.itemRows.nth(index).getByRole('button', { name: /remove|delete/i }).click();
  }

  async setItemQty(index: number, qty: number): Promise<void> {
    const row = this.itemRows.nth(index);
    await row.getByRole('spinbutton').fill(String(qty));
    await this.page.waitForLoadState('networkidle');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/orders/new');
  }

  async getSubtotalText(): Promise<string> {
    return (await this.subtotal.textContent())?.trim() ?? '';
  }
}
