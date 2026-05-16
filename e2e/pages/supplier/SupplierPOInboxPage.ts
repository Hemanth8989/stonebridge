import type { Page, Locator } from '@playwright/test';

export type SupplierPOTab =
  | 'all' | 'sent' | 'acknowledged' | 'countered' | 'confirmed' | 'shipped';

export class SupplierPOInboxPage {
  readonly url = 'http://localhost:5174/orders';

  readonly allTab:          Locator;
  readonly sentTab:         Locator;
  readonly acknowledgedTab: Locator;
  readonly counteredTab:    Locator;
  readonly confirmedTab:    Locator;
  readonly shippedTab:      Locator;

  readonly poCards:         Locator;
  readonly emptyState:      Locator;
  readonly loadingSpinner:  Locator;

  constructor(private readonly page: Page) {
    this.allTab          = page.getByRole('tab', { name: /^all/i });
    this.sentTab         = page.getByRole('tab', { name: /pending|sent/i });
    this.acknowledgedTab = page.getByRole('tab', { name: /acknowledged/i });
    this.counteredTab    = page.getByRole('tab', { name: /countered/i });
    this.confirmedTab    = page.getByRole('tab', { name: /confirmed/i });
    this.shippedTab      = page.getByRole('tab', { name: /shipped/i });
    this.poCards         = page.locator('[data-testid="po-card"]');
    this.emptyState      = page.getByTestId('empty-state');
    this.loadingSpinner  = page.getByRole('status');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async clickTab(tabName: SupplierPOTab): Promise<void> {
    const tabMap: Record<SupplierPOTab, Locator> = {
      all:          this.allTab,
      sent:         this.sentTab,
      acknowledged: this.acknowledgedTab,
      countered:    this.counteredTab,
      confirmed:    this.confirmedTab,
      shipped:      this.shippedTab,
    };
    await tabMap[tabName].click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  getPOCard(index: number): Locator {
    return this.poCards.nth(index);
  }

  getPOCardByNumber(poNumber: string): Locator {
    return this.page.locator(`[data-testid="po-card"][data-po-number="${poNumber}"]`);
  }

  async clickPOCard(index: number): Promise<void> {
    await this.poCards.nth(index).click();
    await this.page.waitForURL('**/orders/**');
  }

  async acknowledgePO(poNumber: string): Promise<void> {
    const card = this.getPOCardByNumber(poNumber);
    await card.getByRole('button', { name: /acknowledge/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async counterPO(poNumber: string): Promise<void> {
    const card = this.getPOCardByNumber(poNumber);
    await card.getByRole('button', { name: /counter/i }).click();
  }

  async getPOCount(): Promise<number> {
    return this.poCards.count();
  }

  async getTabBadgeCount(tabName: string): Promise<string> {
    const tab = this.page.getByRole('tab', { name: new RegExp(tabName, 'i') });
    const badge = tab.locator('[data-testid="tab-count"]');
    return (await badge.textContent()) ?? '0';
  }
}
