import type { Page, Locator } from '@playwright/test';

export class NavigationComponent {
  readonly nav:                Locator;
  readonly logo:               Locator;
  readonly tenantSwitcher:     Locator;
  readonly userMenu:           Locator;
  readonly logoutButton:       Locator;

  constructor(private readonly page: Page) {
    this.nav            = page.getByRole('navigation');
    this.logo           = this.nav.getByRole('link', { name: /stonebridge|home/i }).first();
    this.tenantSwitcher = this.nav.getByTestId('tenant-switcher');
    this.userMenu       = this.nav.getByRole('button', { name: /user menu|account/i });
    this.logoutButton   = this.page.getByRole('menuitem', { name: /log ?out|sign ?out/i });
  }

  async clickLink(name: string | RegExp): Promise<void> {
    const pattern = typeof name === 'string' ? new RegExp(name, 'i') : name;
    await this.nav.getByRole('link', { name: pattern }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }

  async expectActiveLink(name: string | RegExp): Promise<void> {
    const pattern = typeof name === 'string' ? new RegExp(name, 'i') : name;
    await this.nav.getByRole('link', { name: pattern }).waitFor({ state: 'visible' });
  }
}
