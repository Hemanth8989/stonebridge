import type { Page, Response, Locator } from '@playwright/test';

export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  status = 200,
  timeout = 10_000,
): Promise<Response> {
  return page.waitForResponse(
    (res) => {
      const url = res.url();
      const matches = typeof urlPattern === 'string'
        ? url.includes(urlPattern)
        : urlPattern.test(url);
      return matches && res.status() === status;
    },
    { timeout },
  );
}

export async function waitForToast(
  page: Page,
  textPattern: RegExp,
  timeout = 5_000,
): Promise<Locator> {
  const toast = page.getByRole('status').filter({ hasText: textPattern });
  await toast.waitFor({ state: 'visible', timeout });
  return toast;
}

export async function waitForLoadingToFinish(
  page: Page,
  timeout = 10_000,
): Promise<void> {
  const spinners = page.getByRole('status');
  const count = await spinners.count();
  for (let i = 0; i < count; i++) {
    await spinners.nth(i).waitFor({ state: 'hidden', timeout }).catch(() => undefined);
  }
  await page.waitForLoadState('networkidle');
}

export async function waitForLocatorCount(
  locator: Locator,
  expected: number,
  timeout = 5_000,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if ((await locator.count()) === expected) return;
    await locator.page().waitForTimeout(100);
  }
  const actual = await locator.count();
  throw new Error(`Expected ${expected} elements, found ${actual}`);
}

export async function waitForNetworkIdleAfter<T>(
  page: Page,
  action: () => Promise<T>,
): Promise<T> {
  const result = await action();
  await page.waitForLoadState('networkidle');
  return result;
}
