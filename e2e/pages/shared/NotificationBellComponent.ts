import type { Page, Locator } from '@playwright/test';

export class NotificationBellComponent {
  readonly bell:           Locator;
  readonly unreadBadge:    Locator;
  readonly dropdown:       Locator;
  readonly notificationItems: Locator;
  readonly markAllReadButton: Locator;
  readonly emptyState:     Locator;

  constructor(private readonly page: Page) {
    this.bell              = page.getByRole('button', { name: /notifications/i });
    this.unreadBadge       = this.bell.getByTestId('unread-badge');
    this.dropdown          = page.getByTestId('notification-dropdown');
    this.notificationItems = page.locator('[data-testid="notification-item"]');
    this.markAllReadButton = this.dropdown.getByRole('button', { name: /mark all (as )?read/i });
    this.emptyState        = this.dropdown.getByTestId('empty-state');
  }

  async open(): Promise<void> {
    await this.bell.click();
    await this.dropdown.waitFor({ state: 'visible' });
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.dropdown.waitFor({ state: 'hidden' }).catch(() => undefined);
  }

  async getUnreadCount(): Promise<number> {
    if (!(await this.unreadBadge.isVisible().catch(() => false))) return 0;
    const text = (await this.unreadBadge.textContent())?.trim() ?? '0';
    return parseInt(text, 10) || 0;
  }

  async markAllRead(): Promise<void> {
    await this.markAllReadButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickNotification(index: number): Promise<void> {
    await this.notificationItems.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getNotificationCount(): Promise<number> {
    return this.notificationItems.count();
  }
}
