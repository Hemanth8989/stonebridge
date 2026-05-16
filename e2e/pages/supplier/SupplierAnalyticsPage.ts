import type { Page, Locator } from '@playwright/test';

export class SupplierAnalyticsPage {
  readonly url = 'http://localhost:5174/analytics';

  readonly header:              Locator;
  readonly totalRevenueCard:    Locator;
  readonly posFulfilledCard:    Locator;
  readonly avgResponseTimeCard: Locator;
  readonly fulfillmentRateCard: Locator;

  readonly revenueChart:        Locator;
  readonly topBuyersTable:      Locator;
  readonly topBuyerRows:        Locator;
  readonly inventoryAgingTable: Locator;
  readonly inventoryAgingRows:  Locator;

  readonly dateRangeFilter:     Locator;

  constructor(private readonly page: Page) {
    this.header              = page.getByRole('heading', { name: /analytics/i, level: 1 });
    this.totalRevenueCard    = page.getByTestId('stat-card-total-revenue');
    this.posFulfilledCard    = page.getByTestId('stat-card-pos-fulfilled');
    this.avgResponseTimeCard = page.getByTestId('stat-card-avg-response-time');
    this.fulfillmentRateCard = page.getByTestId('stat-card-fulfillment-rate');
    this.revenueChart        = page.getByTestId('revenue-chart');
    this.topBuyersTable      = page.getByTestId('top-buyers-table');
    this.topBuyerRows        = page.locator('[data-testid="top-buyers-table"] tbody tr');
    this.inventoryAgingTable = page.getByTestId('inventory-aging-table');
    this.inventoryAgingRows  = page.locator('[data-testid="inventory-aging-table"] tbody tr');
    this.dateRangeFilter     = page.getByRole('combobox', { name: /date range|period/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async getStatValue(card: Locator): Promise<string> {
    return (await card.locator('[data-testid="stat-value"]').textContent())?.trim() ?? '';
  }

  async getTopBuyerCount(): Promise<number> {
    return this.topBuyerRows.count();
  }

  async getAgingRowCount(): Promise<number> {
    return this.inventoryAgingRows.count();
  }

  async setDateRange(range: string): Promise<void> {
    await this.dateRangeFilter.selectOption(range);
    await this.page.waitForLoadState('networkidle');
  }
}
