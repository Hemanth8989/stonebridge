import type { Page, Locator } from '@playwright/test';

export class SupplierDashboardPage {
  readonly url = 'http://localhost:5174/dashboard';

  readonly todaysPOsCard:       Locator;
  readonly pendingAcksCard:     Locator;
  readonly availableSlabsCard:  Locator;
  readonly monthlyRevenueCard:  Locator;

  readonly recentPOsTable:      Locator;
  readonly recentPORows:        Locator;
  readonly viewAllPOsLink:      Locator;

  readonly lowStockAlerts:      Locator;
  readonly lowStockItems:       Locator;

  readonly addSlabButton:       Locator;
  readonly uploadCsvButton:     Locator;
  readonly viewAllOrdersButton: Locator;

  constructor(private readonly page: Page) {
    this.todaysPOsCard       = page.getByTestId('stat-card-today-pos');
    this.pendingAcksCard     = page.getByTestId('stat-card-pending-acks');
    this.availableSlabsCard  = page.getByTestId('stat-card-available-slabs');
    this.monthlyRevenueCard  = page.getByTestId('stat-card-monthly-revenue');
    this.recentPOsTable      = page.getByTestId('recent-pos-table');
    this.recentPORows        = page.locator('[data-testid="recent-pos-table"] tbody tr');
    this.viewAllPOsLink      = page.getByRole('link', { name: /view all/i }).first();
    this.lowStockAlerts      = page.getByTestId('low-stock-alerts');
    this.lowStockItems       = page.locator('[data-testid="low-stock-alerts"] [data-testid="alert-item"]');
    this.addSlabButton       = page.getByRole('button', { name: /add slab/i }).first();
    this.uploadCsvButton     = page.getByRole('button', { name: /upload csv/i }).first();
    this.viewAllOrdersButton = page.getByRole('button', { name: /view all orders/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
    await this.todaysPOsCard.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);
  }

  async getStatCardValue(card: Locator): Promise<string> {
    return (await card.locator('[data-testid="stat-value"]').textContent()) ?? '';
  }

  async clickAddSlab(): Promise<void> {
    await this.addSlabButton.click();
    await this.page.waitForURL('**/inventory/new');
  }

  async clickViewAllOrders(): Promise<void> {
    await this.viewAllOrdersButton.click();
    await this.page.waitForURL('**/orders');
  }

  async getPORowCount(): Promise<number> {
    return this.recentPORows.count();
  }

  async clickPORow(index: number): Promise<void> {
    await this.recentPORows.nth(index).getByRole('link').first().click();
    await this.page.waitForURL('**/orders/**');
  }
}
