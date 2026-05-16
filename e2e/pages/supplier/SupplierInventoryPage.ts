import type { Page, Locator } from '@playwright/test';

export class SupplierInventoryPage {
  readonly url = 'http://localhost:5174/inventory';

  readonly addSlabButton:      Locator;
  readonly uploadCsvButton:    Locator;

  readonly gridViewButton:     Locator;
  readonly tableViewButton:    Locator;

  readonly searchInput:        Locator;
  readonly materialTypeFilter: Locator;
  readonly statusFilter:       Locator;
  readonly clearFiltersButton: Locator;

  readonly slabCards:          Locator;
  readonly slabRows:           Locator;
  readonly emptyState:         Locator;
  readonly loadingSpinner:     Locator;

  readonly prevPageButton:     Locator;
  readonly nextPageButton:     Locator;
  readonly paginationInfo:     Locator;

  constructor(private readonly page: Page) {
    this.addSlabButton      = page.getByRole('button', { name: /add slab/i });
    this.uploadCsvButton    = page.getByRole('button', { name: /upload csv/i });
    this.gridViewButton     = page.getByRole('button', { name: /grid view/i });
    this.tableViewButton    = page.getByRole('button', { name: /table view/i });
    this.searchInput        = page.getByPlaceholder(/search/i);
    this.materialTypeFilter = page.getByRole('combobox', { name: /material/i });
    this.statusFilter       = page.getByRole('combobox', { name: /status/i });
    this.clearFiltersButton = page.getByRole('button', { name: /clear/i });
    this.slabCards          = page.locator('[data-testid="slab-card"]');
    this.slabRows           = page.locator('[data-testid="slab-table"] tbody tr');
    this.emptyState         = page.getByTestId('empty-state');
    this.loadingSpinner     = page.getByRole('status');
    this.prevPageButton     = page.getByRole('button', { name: /previous/i });
    this.nextPageButton     = page.getByRole('button', { name: /next/i });
    this.paginationInfo     = page.getByTestId('pagination-info');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async switchToGridView(): Promise<void> {
    await this.gridViewButton.click();
    await this.slabCards.first().waitFor({ state: 'visible' }).catch(() => undefined);
  }

  async switchToTableView(): Promise<void> {
    await this.tableViewButton.click();
    await this.slabRows.first().waitFor({ state: 'visible' }).catch(() => undefined);
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByMaterial(materialType: string): Promise<void> {
    await this.materialTypeFilter.selectOption(materialType);
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption(status);
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddSlab(): Promise<void> {
    await this.addSlabButton.click();
    await this.page.waitForURL('**/inventory/new');
  }

  async openSlabActionsMenu(index: number): Promise<void> {
    const row = this.slabRows.nth(index);
    await row.getByRole('button', { name: /actions|more/i }).click();
  }

  async editSlab(index: number): Promise<void> {
    await this.openSlabActionsMenu(index);
    await this.page.getByRole('menuitem', { name: /edit/i }).click();
    await this.page.waitForURL('**/inventory/**/edit');
  }

  async changeSlabStatus(index: number, newStatus: string): Promise<void> {
    await this.openSlabActionsMenu(index);
    await this.page.getByRole('menuitem', { name: /change status/i }).hover();
    await this.page.getByRole('menuitem', { name: new RegExp(newStatus, 'i') }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteSlab(index: number): Promise<void> {
    await this.openSlabActionsMenu(index);
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.page.getByRole('button', { name: /confirm|yes/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getSlabCount(): Promise<number> {
    const cards = await this.slabCards.count();
    if (cards > 0) return cards;
    return this.slabRows.count();
  }
}
