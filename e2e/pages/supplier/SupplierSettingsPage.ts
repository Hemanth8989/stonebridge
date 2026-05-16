import type { Page, Locator } from '@playwright/test';

export type SettingsTab = 'profile' | 'warehouses' | 'integrations' | 'webhooks' | 'notifications';

export interface ProfileFormData {
  displayName?:   string;
  website?:       string;
  phone?:         string;
  city?:          string;
  stateProvince?: string;
  description?:   string;
}

export class SupplierSettingsPage {
  readonly url = 'http://localhost:5174/settings';

  readonly profileTab:       Locator;
  readonly warehousesTab:    Locator;
  readonly integrationsTab:  Locator;
  readonly webhooksTab:      Locator;
  readonly notificationsTab: Locator;

  readonly displayNameInput:    Locator;
  readonly websiteInput:        Locator;
  readonly phoneInput:          Locator;
  readonly cityInput:           Locator;
  readonly stateProvinceInput:  Locator;
  readonly descriptionInput:    Locator;
  readonly saveProfileButton:   Locator;

  readonly morawareToggle:      Locator;
  readonly morawareApiKeyInput: Locator;
  readonly testConnectionButton: Locator;

  readonly toastSuccess:        Locator;

  constructor(private readonly page: Page) {
    this.profileTab       = page.getByRole('tab', { name: /profile/i });
    this.warehousesTab    = page.getByRole('tab', { name: /warehouses?/i });
    this.integrationsTab  = page.getByRole('tab', { name: /integrations?/i });
    this.webhooksTab      = page.getByRole('tab', { name: /webhooks?/i });
    this.notificationsTab = page.getByRole('tab', { name: /notifications/i });

    this.displayNameInput    = page.getByLabel(/display name|company name/i);
    this.websiteInput        = page.getByLabel(/website/i);
    this.phoneInput          = page.getByLabel(/phone/i);
    this.cityInput           = page.getByLabel(/city/i);
    this.stateProvinceInput  = page.getByLabel(/state|province/i);
    this.descriptionInput    = page.getByLabel(/description|about/i);
    this.saveProfileButton   = page.getByRole('button', { name: /save profile|save changes/i });

    this.morawareToggle      = page.getByRole('switch', { name: /moraware/i });
    this.morawareApiKeyInput = page.getByLabel(/moraware api key|api key/i);
    this.testConnectionButton = page.getByRole('button', { name: /test connection/i });

    this.toastSuccess        = page.getByRole('status').filter({ hasText: /saved|success/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  async switchTab(tabName: SettingsTab): Promise<void> {
    const tabMap: Record<SettingsTab, Locator> = {
      profile:       this.profileTab,
      warehouses:    this.warehousesTab,
      integrations:  this.integrationsTab,
      webhooks:      this.webhooksTab,
      notifications: this.notificationsTab,
    };
    await tabMap[tabName].click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillProfileForm(data: ProfileFormData): Promise<void> {
    if (data.displayName   !== undefined) await this.displayNameInput.fill(data.displayName);
    if (data.website       !== undefined) await this.websiteInput.fill(data.website);
    if (data.phone         !== undefined) await this.phoneInput.fill(data.phone);
    if (data.city          !== undefined) await this.cityInput.fill(data.city);
    if (data.stateProvince !== undefined) await this.stateProvinceInput.fill(data.stateProvince);
    if (data.description   !== undefined) await this.descriptionInput.fill(data.description);
  }

  async saveProfile(): Promise<void> {
    await this.saveProfileButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async toggleIntegration(name: string, enabled: boolean): Promise<void> {
    const toggle = this.page.getByRole('switch', { name: new RegExp(name, 'i') });
    const checked = await toggle.isChecked();
    if (checked !== enabled) await toggle.click();
  }

  async setNotificationPreference(
    type: string,
    channel: 'email' | 'in_app' | 'sms',
    enabled: boolean,
  ): Promise<void> {
    const row = this.page.locator(`[data-pref-row="${type}"]`);
    const toggle = row.getByRole('switch', { name: new RegExp(channel.replace('_', ' '), 'i') });
    const checked = await toggle.isChecked();
    if (checked !== enabled) await toggle.click();
  }
}
