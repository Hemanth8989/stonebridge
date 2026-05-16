import type { Page, Locator } from '@playwright/test';

export class FabricatorNewOrderPage {
  readonly url = 'http://localhost:5173/orders/new';

  readonly stepIndicator:        Locator;

  readonly supplierSelect:       Locator;
  readonly nextToItemsButton:    Locator;

  readonly addItemsButton:       Locator;
  readonly addCatalogSlabButton: Locator;
  readonly lineItemRows:         Locator;
  readonly nextToReviewButton:   Locator;

  readonly jobAssignSelect:      Locator;
  readonly requestedDeliveryInput: Locator;
  readonly notesInput:           Locator;
  readonly internalRefInput:     Locator;
  readonly nextToConfirmButton:  Locator;

  readonly poNumberPreview:      Locator;
  readonly totalAmountPreview:   Locator;
  readonly submitOrderButton:    Locator;

  readonly backButton:           Locator;

  constructor(private readonly page: Page) {
    this.stepIndicator         = page.getByTestId('step-indicator');
    this.supplierSelect        = page.getByRole('combobox', { name: /supplier/i });
    this.nextToItemsButton     = page.getByRole('button', { name: /next: items|continue to items|next/i });
    this.addItemsButton        = page.getByRole('button', { name: /add items|browse cart/i });
    this.addCatalogSlabButton  = page.getByRole('button', { name: /add from catalog|catalog/i });
    this.lineItemRows          = page.locator('[data-testid="line-item-row"]');
    this.nextToReviewButton    = page.getByRole('button', { name: /next: review|review/i });
    this.jobAssignSelect       = page.getByRole('combobox', { name: /job|assign to job/i });
    this.requestedDeliveryInput = page.getByLabel(/requested delivery|delivery date/i);
    this.notesInput            = page.getByLabel(/notes|message to supplier/i);
    this.internalRefInput      = page.getByLabel(/internal reference|internal ref/i);
    this.nextToConfirmButton   = page.getByRole('button', { name: /next: confirm|confirm/i });
    this.poNumberPreview       = page.getByTestId('po-number-preview');
    this.totalAmountPreview    = page.getByTestId('total-amount-preview');
    this.submitOrderButton     = page.getByRole('button', { name: /submit order|send to supplier|place order/i });
    this.backButton            = page.getByRole('button', { name: /back/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async selectSupplier(supplierName: string): Promise<void> {
    await this.supplierSelect.click();
    await this.page.getByRole('option', { name: new RegExp(supplierName, 'i') }).click();
  }

  async goToItemsStep(): Promise<void> {
    await this.nextToItemsButton.click();
  }

  async goToReviewStep(): Promise<void> {
    await this.nextToReviewButton.click();
  }

  async goToConfirmStep(): Promise<void> {
    await this.nextToConfirmButton.click();
  }

  async assignJob(jobNumber: string): Promise<void> {
    await this.jobAssignSelect.selectOption({ label: jobNumber });
  }

  async setDelivery(date: string): Promise<void> {
    await this.requestedDeliveryInput.fill(date);
  }

  async setNotes(notes: string): Promise<void> {
    await this.notesInput.fill(notes);
  }

  async setInternalRef(ref: string): Promise<void> {
    await this.internalRefInput.fill(ref);
  }

  async submitOrder(): Promise<void> {
    await this.submitOrderButton.click();
    await this.page.waitForURL('**/orders/**');
  }

  async getLineItemCount(): Promise<number> {
    return this.lineItemRows.count();
  }
}
