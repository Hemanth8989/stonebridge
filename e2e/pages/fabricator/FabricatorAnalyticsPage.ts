import type { Page, Locator } from '@playwright/test';

export class FabricatorAnalyticsPage {
  readonly url = 'http://localhost:5173/analytics';

  readonly header:                Locator;
  readonly spendBySupplierTable:  Locator;
  readonly spendBySupplierRows:   Locator;
  readonly avgLeadTimeTable:      Locator;
  readonly avgLeadTimeRows:       Locator;
  readonly materialCostsTable:    Locator;
  readonly materialCostsRows:     Locator;
  readonly dateRangeFilter:       Locator;

  constructor(private readonly page: Page) {
    this.header               = page.getByRole('heading', { name: /analytics/i, level: 1 });
    this.spendBySupplierTable = page.getByTestId('spend-by-supplier-table');
    this.spendBySupplierRows  = page.locator('[data-testid="spend-by-supplier-table"] tbody tr');
    this.avgLeadTimeTable     = page.getByTestId('avg-lead-time-table');
    this.avgLeadTimeRows      = page.locator('[data-testid="avg-lead-time-table"] tbody tr');
    this.materialCostsTable   = page.getByTestId('material-costs-table');
    this.materialCostsRows    = page.locator('[data-testid="material-costs-table"] tbody tr');
    this.dateRangeFilter      = page.getByRole('combobox', { name: /date range|period/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async getSpendRowCount(): Promise<number> {
    return this.spendBySupplierRows.count();
  }

  async getLeadTimeRowCount(): Promise<number> {
    return this.avgLeadTimeRows.count();
  }

  async getMaterialRowCount(): Promise<number> {
    return this.materialCostsRows.count();
  }

  async setDateRange(range: string): Promise<void> {
    await this.dateRangeFilter.selectOption(range);
    await this.page.waitForLoadState('networkidle');
  }
}
