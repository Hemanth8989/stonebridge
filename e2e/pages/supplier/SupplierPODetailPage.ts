import type { Page, Locator } from '@playwright/test';

export interface CounterOfferInput {
  proposedDelivery?: string;
  note?: string;
  linePrices?: Array<{ lineItemId: string; price: number; reason: string }>;
}

export class SupplierPODetailPage {
  readonly poNumberHeading:    Locator;
  readonly fabricatorName:     Locator;
  readonly statusBadge:        Locator;

  readonly lineItemsTable:     Locator;
  readonly lineItemRows:       Locator;

  readonly acknowledgePanel:   Locator;
  readonly acknowledgeAllButton: Locator;

  readonly counterFormToggle:  Locator;
  readonly counterOfferForm:   Locator;
  readonly proposedDeliveryInput: Locator;
  readonly counterNoteInput:   Locator;
  readonly counterSubmitButton: Locator;

  readonly timeline:           Locator;
  readonly orderSummaryCard:   Locator;

  readonly shippingForm:       Locator;
  readonly trackingInput:      Locator;
  readonly carrierInput:       Locator;
  readonly markShippedButton:  Locator;

  readonly cancelOrderButton:  Locator;

  constructor(private readonly page: Page) {
    this.poNumberHeading      = page.getByRole('heading', { level: 1 });
    this.fabricatorName       = page.getByTestId('po-fabricator-name');
    this.statusBadge          = page.getByTestId('po-status-badge');
    this.lineItemsTable       = page.getByTestId('po-line-items-table');
    this.lineItemRows         = page.locator('[data-testid="po-line-items-table"] tbody tr');
    this.acknowledgePanel     = page.getByTestId('acknowledge-panel');
    this.acknowledgeAllButton = page.getByRole('button', { name: /acknowledge all|confirm all/i });
    this.counterFormToggle    = page.getByRole('button', { name: /counter offer|propose counter/i });
    this.counterOfferForm     = page.getByTestId('counter-offer-form');
    this.proposedDeliveryInput = this.counterOfferForm.getByLabel(/proposed delivery|delivery date/i);
    this.counterNoteInput     = this.counterOfferForm.getByLabel(/note|message/i);
    this.counterSubmitButton  = this.counterOfferForm.getByRole('button', { name: /submit|send counter/i });
    this.timeline             = page.getByTestId('po-timeline');
    this.orderSummaryCard     = page.getByTestId('order-summary-card');
    this.shippingForm         = page.getByTestId('shipping-form');
    this.trackingInput        = this.shippingForm.getByLabel(/tracking/i);
    this.carrierInput         = this.shippingForm.getByLabel(/carrier/i);
    this.markShippedButton    = this.shippingForm.getByRole('button', { name: /mark shipped|ship/i });
    this.cancelOrderButton    = page.getByRole('button', { name: /cancel order/i });
  }

  async goto(id: string): Promise<void> {
    await this.page.goto(`http://localhost:5174/orders/${id}`);
    await this.page.waitForLoadState('networkidle');
    await this.poNumberHeading.waitFor({ state: 'visible' }).catch(() => undefined);
  }

  async getStatusText(): Promise<string> {
    return (await this.statusBadge.textContent())?.trim() ?? '';
  }

  async getLineItemCount(): Promise<number> {
    return this.lineItemRows.count();
  }

  async acknowledgeAll(): Promise<void> {
    await this.acknowledgeAllButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async acknowledgeLines(lineIds: string[]): Promise<void> {
    for (const id of lineIds) {
      const row = this.page.locator(`[data-line-id="${id}"]`);
      await row.getByRole('button', { name: /acknowledge|confirm/i }).click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async declineLine(lineId: string, reason: string): Promise<void> {
    const row = this.page.locator(`[data-line-id="${lineId}"]`);
    await row.getByRole('button', { name: /decline/i }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel(/reason/i).fill(reason);
    await dialog.getByRole('button', { name: /submit|confirm/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async openCounterForm(): Promise<void> {
    await this.counterFormToggle.click();
    await this.counterOfferForm.waitFor({ state: 'visible' });
  }

  async submitCounter(input: CounterOfferInput): Promise<void> {
    if (input.proposedDelivery) await this.proposedDeliveryInput.fill(input.proposedDelivery);
    if (input.note)             await this.counterNoteInput.fill(input.note);
    if (input.linePrices) {
      for (const { lineItemId, price, reason } of input.linePrices) {
        const row = this.page.locator(`[data-line-id="${lineItemId}"]`);
        await row.getByLabel(/counter price|proposed price/i).fill(String(price));
        await row.getByLabel(/reason/i).fill(reason);
      }
    }
    await this.counterSubmitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async markShipped(trackingNumber: string, carrier: string): Promise<void> {
    await this.trackingInput.fill(trackingNumber);
    await this.carrierInput.fill(carrier);
    await this.markShippedButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async cancelOrder(reason: string): Promise<void> {
    await this.cancelOrderButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByLabel(/reason/i).fill(reason);
    await dialog.getByRole('button', { name: /confirm|cancel order/i }).click();
    await this.page.waitForLoadState('networkidle');
  }
}
