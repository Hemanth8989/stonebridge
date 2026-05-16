import type { Page, Locator } from '@playwright/test';

export class FabricatorJobDetailPage {
  readonly heading:           Locator;
  readonly statusBadge:       Locator;
  readonly customerInfoCard:  Locator;
  readonly materialBudgetCard: Locator;
  readonly orderedTotalCard:  Locator;
  readonly receivedTotalCard: Locator;
  readonly jobPOsTable:       Locator;
  readonly jobPORows:         Locator;
  readonly orderForJobButton: Locator;
  readonly editJobButton:     Locator;
  readonly statusSelect:      Locator;

  constructor(private readonly page: Page) {
    this.heading            = page.getByRole('heading', { level: 1 });
    this.statusBadge        = page.getByTestId('job-status-badge');
    this.customerInfoCard   = page.getByTestId('customer-info-card');
    this.materialBudgetCard = page.getByTestId('material-budget-card');
    this.orderedTotalCard   = page.getByTestId('ordered-total-card');
    this.receivedTotalCard  = page.getByTestId('received-total-card');
    this.jobPOsTable        = page.getByTestId('job-pos-table');
    this.jobPORows          = page.locator('[data-testid="job-pos-table"] tbody tr');
    this.orderForJobButton  = page.getByRole('button', { name: /order for job|new order/i });
    this.editJobButton      = page.getByRole('button', { name: /edit job/i });
    this.statusSelect       = page.getByRole('combobox', { name: /status/i });
  }

  async goto(id: string): Promise<void> {
    await this.page.goto(`http://localhost:5173/jobs/${id}`);
    await this.page.waitForLoadState('networkidle');
  }

  async clickOrderForJob(): Promise<void> {
    await this.orderForJobButton.click();
    await this.page.waitForURL('**/orders/new**');
  }

  async changeStatus(status: string): Promise<void> {
    await this.statusSelect.selectOption(status);
    await this.page.waitForLoadState('networkidle');
  }

  async getPOCount(): Promise<number> {
    return this.jobPORows.count();
  }
}
