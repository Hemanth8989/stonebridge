import type { Page, Locator } from '@playwright/test';

export interface NewJobInput {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  jobName:        string;
  installDate?:   string;
  materialBudget?: number;
  notes?:         string;
}

export class FabricatorJobsPage {
  readonly url = 'http://localhost:5173/jobs';

  readonly newJobButton:    Locator;
  readonly searchInput:     Locator;
  readonly statusFilter:    Locator;
  readonly jobRows:         Locator;
  readonly jobCards:        Locator;
  readonly emptyState:      Locator;

  readonly newJobDialog:    Locator;
  readonly jobNameInput:    Locator;
  readonly customerNameInput: Locator;
  readonly customerEmailInput: Locator;
  readonly customerPhoneInput: Locator;
  readonly installDateInput:   Locator;
  readonly materialBudgetInput: Locator;
  readonly notesInput:      Locator;
  readonly saveJobButton:   Locator;

  constructor(private readonly page: Page) {
    this.newJobButton  = page.getByRole('button', { name: /new job|create job/i });
    this.searchInput   = page.getByPlaceholder(/search jobs|search/i);
    this.statusFilter  = page.getByRole('combobox', { name: /status/i });
    this.jobRows       = page.locator('[data-testid="job-row"]');
    this.jobCards      = page.locator('[data-testid="job-card"]');
    this.emptyState    = page.getByTestId('empty-state');

    this.newJobDialog        = page.getByRole('dialog');
    this.jobNameInput        = this.newJobDialog.getByLabel(/job name/i);
    this.customerNameInput   = this.newJobDialog.getByLabel(/customer name/i);
    this.customerEmailInput  = this.newJobDialog.getByLabel(/customer email|email/i);
    this.customerPhoneInput  = this.newJobDialog.getByLabel(/customer phone|phone/i);
    this.installDateInput    = this.newJobDialog.getByLabel(/install date/i);
    this.materialBudgetInput = this.newJobDialog.getByLabel(/material budget|budget/i);
    this.notesInput          = this.newJobDialog.getByLabel(/notes/i);
    this.saveJobButton       = this.newJobDialog.getByRole('button', { name: /save|create/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async createJob(input: NewJobInput): Promise<void> {
    await this.newJobButton.click();
    await this.newJobDialog.waitFor({ state: 'visible' });
    await this.jobNameInput.fill(input.jobName);
    if (input.customerName)   await this.customerNameInput.fill(input.customerName);
    if (input.customerEmail)  await this.customerEmailInput.fill(input.customerEmail);
    if (input.customerPhone)  await this.customerPhoneInput.fill(input.customerPhone);
    if (input.installDate)    await this.installDateInput.fill(input.installDate);
    if (input.materialBudget !== undefined) await this.materialBudgetInput.fill(String(input.materialBudget));
    if (input.notes)          await this.notesInput.fill(input.notes);
    await this.saveJobButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async openJob(index: number): Promise<void> {
    const card = this.jobCards.nth(index);
    const row  = this.jobRows.nth(index);
    const target = (await card.count()) > 0 ? card : row;
    await target.click();
    await this.page.waitForURL('**/jobs/**');
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption(status);
    await this.page.waitForLoadState('networkidle');
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForLoadState('networkidle');
  }

  async getJobCount(): Promise<number> {
    const cardCount = await this.jobCards.count();
    return cardCount > 0 ? cardCount : this.jobRows.count();
  }
}
