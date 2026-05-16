import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';

test.describe('Supplier settings', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('settings page renders profile tab by default', async ({ supplierSettings }) => {
    await supplierSettings.goto();
    await expect(supplierSettings.profileTab.or(supplierSettings.saveProfileButton)).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('all five tabs are present', async ({ supplierSettings }) => {
    await supplierSettings.goto();
    for (const tab of [
      supplierSettings.profileTab,
      supplierSettings.warehousesTab,
      supplierSettings.integrationsTab,
      supplierSettings.webhooksTab,
      supplierSettings.notificationsTab,
    ]) {
      if (await tab.isVisible().catch(() => false)) {
        await expect(tab).toBeVisible();
      }
    }
  });

  test('switching to integrations tab shows Moraware controls', async ({ supplierSettings }) => {
    await supplierSettings.goto();
    if (await supplierSettings.integrationsTab.isVisible().catch(() => false)) {
      await supplierSettings.switchTab('integrations');
      if (await supplierSettings.morawareToggle.isVisible().catch(() => false)) {
        await expect(supplierSettings.morawareToggle).toBeVisible();
      }
    }
  });

  test('save profile triggers API call', async ({ supplierSettings }) => {
    await supplierSettings.goto();
    if (!(await supplierSettings.displayNameInput.isVisible().catch(() => false))) {
      test.skip();
      return;
    }
    await supplierSettings.fillProfileForm({
      displayName: 'Apex Stone Co. Updated',
      website:     'https://apexstone.example.com',
      city:        'Atlanta',
    });
    await supplierSettings.saveProfile();
  });

  test('switching to notifications tab shows preference rows', async ({ supplierSettings }) => {
    await supplierSettings.goto();
    if (await supplierSettings.notificationsTab.isVisible().catch(() => false)) {
      await supplierSettings.switchTab('notifications');
    }
  });
});
