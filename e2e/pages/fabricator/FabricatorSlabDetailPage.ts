import type { Page, Locator } from '@playwright/test';

export class FabricatorSlabDetailPage {
  readonly heading:           Locator;
  readonly photoGallery:      Locator;
  readonly photoThumbnails:   Locator;
  readonly priceDisplay:      Locator;
  readonly supplierName:      Locator;
  readonly specificationsTable: Locator;
  readonly addToCartButton:   Locator;
  readonly addToJobButton:    Locator;
  readonly reserveButton:     Locator;
  readonly backToCatalogLink: Locator;
  readonly relatedSlabsSection: Locator;

  constructor(private readonly page: Page) {
    this.heading             = page.getByRole('heading', { level: 1 });
    this.photoGallery        = page.getByTestId('slab-photo-gallery');
    this.photoThumbnails     = page.locator('[data-testid="slab-photo-gallery"] [data-testid="photo-thumb"]');
    this.priceDisplay        = page.getByTestId('slab-price');
    this.supplierName        = page.getByTestId('slab-supplier-name');
    this.specificationsTable = page.getByTestId('slab-specs');
    this.addToCartButton     = page.getByRole('button', { name: /add to cart/i });
    this.addToJobButton      = page.getByRole('button', { name: /add to job/i });
    this.reserveButton       = page.getByRole('button', { name: /reserve/i });
    this.backToCatalogLink   = page.getByRole('link', { name: /back to catalog|back/i });
    this.relatedSlabsSection = page.getByTestId('related-slabs');
  }

  async goto(slabId: string): Promise<void> {
    await this.page.goto(`http://localhost:5173/catalog/${slabId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addToJob(jobNumber?: string): Promise<void> {
    await this.addToJobButton.click();
    if (jobNumber) {
      const dialog = this.page.getByRole('dialog');
      await dialog.getByRole('combobox', { name: /job/i }).selectOption(jobNumber);
      await dialog.getByRole('button', { name: /add|confirm/i }).click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async openThumbnail(index: number): Promise<void> {
    await this.photoThumbnails.nth(index).click();
  }

  async getPriceText(): Promise<string> {
    return (await this.priceDisplay.textContent())?.trim() ?? '';
  }
}
