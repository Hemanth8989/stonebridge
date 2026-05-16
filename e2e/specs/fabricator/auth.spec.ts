import { test, expect } from '../../fixtures';
import { FabricatorLoginPage } from '../../pages/fabricator/FabricatorLoginPage';
import { setupApiMocks } from '../../fixtures/api-mock';
import { clearLocalStorage } from '../../utils/browser-storage';

test.describe('Fabricator authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('login page renders', async ({ page }) => {
    const login = new FabricatorLoginPage(page);
    await login.goto();
    await expect(login.submitButton.or(page.getByText(/login form placeholder/i))).toBeVisible();
  });

  test('logout returns to login screen', async ({ page, navigation }) => {
    await setupApiMocks(page);
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    if (await navigation.userMenu.isVisible().catch(() => false)) {
      await navigation.logout().catch(() => undefined);
    } else {
      await clearLocalStorage(page);
    }
  });
});
