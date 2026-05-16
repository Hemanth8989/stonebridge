import type { Page, Locator } from '@playwright/test';

export class FabricatorSuppliersPage {
  readonly url = 'http://localhost:5173/suppliers';

  readonly searchInput:        Locator;
  readonly stateFilter:        Locator;
  readonly verifiedFilter:     Locator;

  readonly directoryTab:       Locator;
  readonly connectedTab:       Locator;
  readonly pendingTab:         Locator;

  readonly supplierCards:      Locator;
  readonly emptyState:         Locator;

  readonly connectDialog:      Locator;
  readonly requestMessageInput: Locator;
  readonly sendRequestButton:  Locator;

  constructor(private readonly page: Page) {
    this.searchInput        = page.getByPlaceholder(/search suppliers|search/i);
    this.stateFilter        = page.getByRole('combobox', { name: /state|location/i });
    this.verifiedFilter     = page.getByRole('switch', { name: /verified/i });

    this.directoryTab       = page.getByRole('tab', { name: /directory|browse/i });
    this.connectedTab       = page.getByRole('tab', { name: /connected/i });
    this.pendingTab         = page.getByRole('tab', { name: /pending/i });

    this.supplierCards      = page.locator('[data-testid="supplier-card"]');
    this.emptyState         = page.getByTestId('empty-state');

    this.connectDialog      = page.getByRole('dialog');
    this.requestMessageInput = this.connectDialog.getByLabel(/message|note/i);
    this.sendRequestButton  = this.connectDialog.getByRole('button', { name: /send request|send/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }

  async clickTab(tab: 'directory' | 'connected' | 'pending'): Promise<void> {
    const map = {
      directory: this.directoryTab,
      connected: this.connectedTab,
      pending:   this.pendingTab,
    };
    await map[tab].click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async sendConnectionRequest(index: number, message?: string): Promise<void> {
    const card = this.supplierCards.nth(index);
    await card.getByRole('button', { name: /connect|request connection/i }).click();
    await this.connectDialog.waitFor({ state: 'visible' });
    if (message) await this.requestMessageInput.fill(message);
    await this.sendRequestButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openSupplierProfile(index: number): Promise<void> {
    await this.supplierCards.nth(index).getByRole('link', { name: /view profile|view details/i }).click();
  }

  async getSupplierCount(): Promise<number> {
    return this.supplierCards.count();
  }
}
