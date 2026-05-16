import type { Page, Locator } from '@playwright/test';

export type FabricatorOrderTab =
  | 'all' | 'draft' | 'sent' | 'acknowledged' | 'shipped' | 'received';

export class FabricatorOrdersPage {
  readonly url = 'http://localhost:5173/orders';

  readonly newOrderButton:  Locator;
  readonly searchInput:     Locator;
  readonly statusFilter:    Locator;
  readonly supplierFilter:  Locator;

  readonly allTab:          Locator;
  readonly draftTab:        Locator;
  readonly sentTab:         Locator;
  readonly acknowledgedTab: Locator;
  readonly shippedTab:      Locator;
  readonly receivedTab:     Locator;

  readonly orderRows:       Locator;
  readonly orderCards:      Locator;
  readonly emptyState:      Locator;

  constructor(private readonly page: Page) {
    this.newOrderButton  = page.getByRole('link', { name: /new order|create order/i });
    this.searchInput     = page.getByPlaceholder(/search orders|search/i);
    this.statusFilter    = page.getByRole('combobox', { name: /status/i });
    this.supplierFilter  = page.getByRole('combobox', { name: /supplier/i });

    this.allTab          = page.getByRole('tab', { name: /^all/i });
    this.draftTab        = page.getByRole('tab', { name: /draft/i });
    this.sentTab         = page.getByRole('tab', { name: /sent/i });
    this.acknowledgedTab = page.getByRole('tab', { name: /acknowledged/i });
    this.shippedTab      = page.getByRole('tab', { name: /shipped/i });
    this.receivedTab     = page.getByRole('tab', { name: /received/i });

    this.orderRows       = page.locator('[data-testid="order-row"]');
    this.orderCards      = page.locator('[data-testid="order-card"]');
    this.emptyState      = page.getByTestId('empty-state');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async clickTab(tab: FabricatorOrderTab): Promise<void> {
    const map: Record<FabricatorOrderTab, Locator> = {
      all:          this.allTab,
      draft:        this.draftTab,
      sent:         this.sentTab,
      acknowledged: this.acknowledgedTab,
      shipped:      this.shippedTab,
      received:     this.receivedTab,
    };
    await map[tab].click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNewOrder(): Promise<void> {
    await this.newOrderButton.click();
    await this.page.waitForURL('**/orders/new');
  }

  async openOrder(index: number): Promise<void> {
    const card  = this.orderCards.nth(index);
    const row   = this.orderRows.nth(index);
    const target = (await card.count()) > 0 ? card : row;
    await target.click();
    await this.page.waitForURL('**/orders/**');
  }

  async getOrderCount(): Promise<number> {
    const cardCount = await this.orderCards.count();
    return cardCount > 0 ? cardCount : this.orderRows.count();
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }
}
