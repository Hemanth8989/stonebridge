import type { Page, Locator } from '@playwright/test';

export class FabricatorOrderDetailPage {
  readonly heading:           Locator;
  readonly statusBadge:       Locator;
  readonly supplierName:      Locator;
  readonly lineItemsTable:    Locator;
  readonly lineItemRows:      Locator;
  readonly timeline:          Locator;
  readonly orderSummaryCard:  Locator;

  readonly counterOfferBanner: Locator;
  readonly acceptCounterButton: Locator;
  readonly rejectCounterButton: Locator;

  readonly confirmReceiptButton: Locator;
  readonly reportDiscrepancyButton: Locator;
  readonly cancelOrderButton:  Locator;
  readonly downloadPdfButton:  Locator;

  constructor(private readonly page: Page) {
    this.heading             = page.getByRole('heading', { level: 1 });
    this.statusBadge         = page.getByTestId('po-status-badge');
    this.supplierName        = page.getByTestId('po-supplier-name');
    this.lineItemsTable      = page.getByTestId('po-line-items-table');
    this.lineItemRows        = page.locator('[data-testid="po-line-items-table"] tbody tr');
    this.timeline            = page.getByTestId('po-timeline');
    this.orderSummaryCard    = page.getByTestId('order-summary-card');
    this.counterOfferBanner  = page.getByTestId('counter-offer-banner');
    this.acceptCounterButton = page.getByRole('button', { name: /accept counter|accept/i });
    this.rejectCounterButton = page.getByRole('button', { name: /reject counter|reject/i });
    this.confirmReceiptButton = page.getByRole('button', { name: /confirm receipt|mark received/i });
    this.reportDiscrepancyButton = page.getByRole('button', { name: /report discrepancy/i });
    this.cancelOrderButton   = page.getByRole('button', { name: /cancel order/i });
    this.downloadPdfButton   = page.getByRole('button', { name: /download pdf|print/i });
  }

  async goto(id: string): Promise<void> {
    await this.page.goto(`http://localhost:5173/orders/${id}`);
    await this.page.waitForLoadState('networkidle');
    await this.heading.waitFor({ state: 'visible' }).catch(() => undefined);
  }

  async getStatusText(): Promise<string> {
    return (await this.statusBadge.textContent())?.trim() ?? '';
  }

  async acceptCounter(): Promise<void> {
    await this.acceptCounterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async rejectCounter(): Promise<void> {
    await this.rejectCounterButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async confirmReceipt(condition: 'perfect' | 'minor_damage' | 'major_damage' | 'wrong_item' | 'short_shipped' = 'perfect', note?: string): Promise<void> {
    await this.confirmReceiptButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('combobox', { name: /condition/i }).selectOption(condition);
    if (note) await dialog.getByLabel(/note|comment/i).fill(note);
    await dialog.getByRole('button', { name: /confirm|submit/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async reportDiscrepancy(reason: string): Promise<void> {
    await this.reportDiscrepancyButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel(/discrepancy|details/i).fill(reason);
    await dialog.getByRole('button', { name: /submit|report/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async cancelOrder(reason: string): Promise<void> {
    await this.cancelOrderButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel(/reason/i).fill(reason);
    await dialog.getByRole('button', { name: /confirm|cancel order/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getLineItemCount(): Promise<number> {
    return this.lineItemRows.count();
  }
}
