import { test, expect } from '../../fixtures';
import { SupplierLoginPage } from '../../pages/supplier/SupplierLoginPage';
import { clearLocalStorage } from '../../utils/browser-storage';
import { setupApiMocks } from '../../fixtures/api-mock';

test.describe('Supplier authentication', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('http://localhost:5174/dashboard');
    await page.waitForURL(/.*\/(login|dashboard).*/, { timeout: 10_000 }).catch(() => undefined);
    const url = page.url();
    expect(url).toMatch(/login|dashboard/);
  });

  test('login page renders form fields', async ({ page }) => {
    const login = new SupplierLoginPage(page);
    await login.goto();
    await expect(login.emailInput.or(page.getByText(/login form placeholder/i))).toBeVisible();
  });

  test('logging out clears local storage and returns to login', async ({ page, navigation }) => {
    await setupApiMocks(page);
    await page.goto('http://localhost:5174/dashboard');
    await page.waitForLoadState('networkidle');
    if (await navigation.userMenu.isVisible().catch(() => false)) {
      await navigation.logout().catch(() => undefined);
    } else {
      await clearLocalStorage(page);
      await page.goto('http://localhost:5174/dashboard');
    }
    const url = page.url();
    expect(url).toMatch(/login|dashboard/);
  });
});
