import type { Page, Locator } from '@playwright/test';

export interface CatalogFilters {
  materials?:   string[];
  colors?:      string[];
  finishes?:    string[];
  thicknessMin?: number;
  thicknessMax?: number;
  priceMin?:    number;
  priceMax?:    number;
  minSqft?:     number;
  remnantsOnly?: boolean;
}

export class FabricatorCatalogPage {
  readonly url = 'http://localhost:5173/catalog';

  readonly filterSidebar:      Locator;
  readonly clearAllFilters:    Locator;
  readonly thicknessMinInput:  Locator;
  readonly thicknessMaxInput:  Locator;
  readonly priceMinInput:      Locator;
  readonly priceMaxInput:      Locator;
  readonly minSqftInput:       Locator;
  readonly remnantsToggle:     Locator;

  readonly searchInput:        Locator;
  readonly sortDropdown:       Locator;
  readonly gridViewButton:     Locator;
  readonly listViewButton:     Locator;

  readonly resultsCount:       Locator;
  readonly slabCards:          Locator;
  readonly emptyState:         Locator;

  readonly prevPageButton:     Locator;
  readonly nextPageButton:     Locator;

  constructor(private readonly page: Page) {
    this.filterSidebar     = page.getByTestId('filter-sidebar');
    this.clearAllFilters   = page.getByRole('button', { name: /clear all|reset filters/i });
    this.thicknessMinInput = page.getByLabel(/min thickness/i);
    this.thicknessMaxInput = page.getByLabel(/max thickness/i);
    this.priceMinInput     = page.getByLabel(/min price/i);
    this.priceMaxInput     = page.getByLabel(/max price/i);
    this.minSqftInput      = page.getByLabel(/min sq.?ft|minimum sq/i);
    this.remnantsToggle    = page.getByRole('switch', { name: /remnant/i });

    this.searchInput       = page.getByPlaceholder(/search catalog|search/i);
    this.sortDropdown      = page.getByRole('combobox', { name: /sort/i });
    this.gridViewButton    = page.getByRole('button', { name: /grid view/i });
    this.listViewButton    = page.getByRole('button', { name: /list view/i });

    this.resultsCount      = page.getByTestId('results-count');
    this.slabCards         = page.locator('[data-testid="slab-card"]');
    this.emptyState        = page.getByTestId('empty-state');

    this.prevPageButton    = page.getByRole('button', { name: /previous/i });
    this.nextPageButton    = page.getByRole('button', { name: /next/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async applyFilters(filters: CatalogFilters): Promise<void> {
    if (filters.materials) {
      for (const m of filters.materials) {
        await this.page.locator(`[data-testid="material-checkbox-${m}"]`).check();
      }
    }
    if (filters.colors) {
      for (const c of filters.colors) {
        await this.page.locator(`[data-testid="color-swatch-${c}"]`).click();
      }
    }
    if (filters.finishes) {
      for (const f of filters.finishes) {
        await this.page.locator(`[data-testid="finish-checkbox-${f}"]`).check();
      }
    }
    if (filters.thicknessMin !== undefined) await this.thicknessMinInput.fill(String(filters.thicknessMin));
    if (filters.thicknessMax !== undefined) await this.thicknessMaxInput.fill(String(filters.thicknessMax));
    if (filters.priceMin     !== undefined) await this.priceMinInput.fill(String(filters.priceMin));
    if (filters.priceMax     !== undefined) await this.priceMaxInput.fill(String(filters.priceMax));
    if (filters.minSqft      !== undefined) await this.minSqftInput.fill(String(filters.minSqft));
    if (filters.remnantsOnly === true)  await this.remnantsToggle.check();
    if (filters.remnantsOnly === false) await this.remnantsToggle.uncheck();
    await this.page.waitForLoadState('networkidle');
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
    await this.page.waitForLoadState('networkidle');
  }

  async clearFilters(): Promise<void> {
    await this.clearAllFilters.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getResultsCount(): Promise<number> {
    return this.slabCards.count();
  }

  async openSlab(index: number): Promise<void> {
    await this.slabCards.nth(index).click();
    await this.page.waitForURL('**/catalog/**');
  }

  async addSlabToCart(index: number): Promise<void> {
    const card = this.slabCards.nth(index);
    await card.getByRole('button', { name: /add to cart|reserve/i }).click();
  }

  async toggleCompare(index: number): Promise<void> {
    const card = this.slabCards.nth(index);
    await card.getByRole('button', { name: /compare/i }).click();
  }
}
