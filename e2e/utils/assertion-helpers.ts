import { expect, type Page, type Locator } from '@playwright/test';

export async function expectVisible(locator: Locator, message?: string): Promise<void> {
  await expect(locator, message).toBeVisible();
}

export async function expectHidden(locator: Locator): Promise<void> {
  await expect(locator).toBeHidden();
}

export async function expectTextContent(locator: Locator, text: string | RegExp): Promise<void> {
  await expect(locator).toContainText(text);
}

export async function expectUrl(page: Page, pattern: string | RegExp): Promise<void> {
  await expect(page).toHaveURL(pattern);
}

export async function expectStatusBadge(locator: Locator, status: string): Promise<void> {
  await expect(locator).toContainText(new RegExp(status, 'i'));
}

export async function expectRowCount(
  rowLocator: Locator,
  expectedCount: number,
): Promise<void> {
  await expect(rowLocator).toHaveCount(expectedCount);
}

export async function expectFormFieldError(page: Page, fieldLabel: RegExp): Promise<void> {
  const field = page.getByLabel(fieldLabel);
  await expect(field).toHaveAttribute('aria-invalid', 'true');
}

export async function expectToastSuccess(page: Page, textPattern: RegExp): Promise<void> {
  const toast = page.getByRole('status').filter({ hasText: textPattern });
  await expect(toast).toBeVisible({ timeout: 5_000 });
}

export async function expectToastError(page: Page, textPattern: RegExp): Promise<void> {
  const toast = page.getByRole('alert').filter({ hasText: textPattern });
  await expect(toast).toBeVisible({ timeout: 5_000 });
}

export async function expectButtonEnabled(button: Locator): Promise<void> {
  await expect(button).toBeEnabled();
}

export async function expectButtonDisabled(button: Locator): Promise<void> {
  await expect(button).toBeDisabled();
}
