import type { Page } from '@playwright/test';

export async function setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(
    ({ k, v }) => localStorage.setItem(k, v),
    { k: key, v: value },
  );
}

export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

export async function removeLocalStorageItem(page: Page, key: string): Promise<void> {
  await page.evaluate((k) => localStorage.removeItem(k), key);
}

export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

export async function getLocalStorageJSON<T>(page: Page, key: string): Promise<T | null> {
  const raw = await getLocalStorageItem(page, key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setSessionStorageItem(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(
    ({ k, v }) => sessionStorage.setItem(k, v),
    { k: key, v: value },
  );
}

export async function clearSessionStorage(page: Page): Promise<void> {
  await page.evaluate(() => sessionStorage.clear());
}

export async function setCartState(page: Page, items: Array<{ slabId: string; qty: number }>): Promise<void> {
  await page.evaluate((data) => {
    localStorage.setItem('sb-fabricator-cart', JSON.stringify({
      state: { items: data },
      version: 0,
    }));
  }, items);
}
