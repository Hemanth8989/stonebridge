import type { Page, Locator } from '@playwright/test';

export class SupplierConnectionsPage {
  readonly url = 'http://localhost:5174/connections';

  readonly pendingRequestsSection:   Locator;
  readonly requestCards:             Locator;
  readonly activeConnectionsSection: Locator;
  readonly connectionCards:          Locator;
  readonly emptyState:               Locator;

  constructor(private readonly page: Page) {
    this.pendingRequestsSection   = page.getByTestId('pending-requests');
    this.requestCards             = page.locator('[data-testid="connection-request-card"]');
    this.activeConnectionsSection = page.getByTestId('active-connections');
    this.connectionCards          = page.locator('[data-testid="connection-card"]');
    this.emptyState               = page.getByTestId('empty-state');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async approveRequest(index: number): Promise<void> {
    await this.requestCards.nth(index).getByRole('button', { name: /approve|accept/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async declineRequest(index: number, reason?: string): Promise<void> {
    await this.requestCards.nth(index).getByRole('button', { name: /decline|reject/i }).click();
    if (reason) {
      const dialog = this.page.getByRole('dialog');
      await dialog.getByLabel(/reason/i).fill(reason);
      await dialog.getByRole('button', { name: /confirm|submit/i }).click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async suspendConnection(index: number): Promise<void> {
    await this.connectionCards.nth(index).getByRole('button', { name: /suspend|pause/i }).click();
    await this.page.getByRole('dialog').getByRole('button', { name: /confirm/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getRequestCount(): Promise<number> {
    return this.requestCards.count();
  }

  async getConnectionCount(): Promise<number> {
    return this.connectionCards.count();
  }
}
