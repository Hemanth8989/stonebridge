import type { Page, Locator } from '@playwright/test';

export class FabricatorDashboardPage {
  readonly url = 'http://localhost:5173/dashboard';

  readonly openPOsCard:           Locator;
  readonly jobsThisMonthCard:     Locator;
  readonly connectedSuppliersCard: Locator;
  readonly pendingDeliveriesCard: Locator;

  readonly cartReminderBanner:    Locator;
  readonly recentOrdersTable:     Locator;
  readonly recentOrderRows:       Locator;
  readonly supplierAlertsSection: Locator;
  readonly supplierAlerts:        Locator;

  readonly browseCatalogLink:     Locator;
  readonly createOrderLink:       Locator;
  readonly newJobLink:            Locator;
  readonly findSuppliersLink:     Locator;

  constructor(private readonly page: Page) {
    this.openPOsCard            = page.getByTestId('stat-card-open-pos');
    this.jobsThisMonthCard      = page.getByTestId('stat-card-jobs-this-month');
    this.connectedSuppliersCard = page.getByTestId('stat-card-connected-suppliers');
    this.pendingDeliveriesCard  = page.getByTestId('stat-card-pending-deliveries');

    this.cartReminderBanner     = page.getByTestId('cart-reminder-banner');
    this.recentOrdersTable      = page.getByTestId('recent-orders-table');
    this.recentOrderRows        = page.locator('[data-testid="recent-orders-table"] tbody tr');
    this.supplierAlertsSection  = page.getByTestId('supplier-alerts');
    this.supplierAlerts         = page.locator('[data-testid="supplier-alerts"] [data-testid="alert-item"]');

    this.browseCatalogLink      = page.getByRole('link', { name: /browse catalog/i });
    this.createOrderLink        = page.getByRole('link', { name: /create order|new order/i });
    this.newJobLink             = page.getByRole('link', { name: /new job/i });
    this.findSuppliersLink      = page.getByRole('link', { name: /find suppliers/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async getStatValue(card: Locator): Promise<string> {
    return (await card.locator('[data-testid="stat-value"]').textContent())?.trim() ?? '';
  }

  async isCartBannerVisible(): Promise<boolean> {
    return this.cartReminderBanner.isVisible();
  }

  async getOrderRowCount(): Promise<number> {
    return this.recentOrderRows.count();
  }

  async clickQuickAction(name: 'catalog' | 'order' | 'job' | 'suppliers'): Promise<void> {
    const map = {
      catalog: this.browseCatalogLink,
      order: this.createOrderLink,
      job: this.newJobLink,
      suppliers: this.findSuppliersLink,
    };
    await map[name].click();
    await this.page.waitForLoadState('networkidle');
  }
}
