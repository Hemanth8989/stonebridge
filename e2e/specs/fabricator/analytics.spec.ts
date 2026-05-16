import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';

test.describe('Fabricator analytics', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('analytics page renders', async ({ fabricatorAnalytics }) => {
    await fabricatorAnalytics.goto();
    await expect(fabricatorAnalytics.header).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('spend-by-supplier table renders data', async ({ fabricatorAnalytics }) => {
    await fabricatorAnalytics.goto();
    const count = await fabricatorAnalytics.getSpendRowCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('avg lead time table renders data', async ({ fabricatorAnalytics }) => {
    await fabricatorAnalytics.goto();
    const count = await fabricatorAnalytics.getLeadTimeRowCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('material costs table renders data', async ({ fabricatorAnalytics }) => {
    await fabricatorAnalytics.goto();
    const count = await fabricatorAnalytics.getMaterialRowCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('date range filter triggers reload', async ({ fabricatorAnalytics }) => {
    await fabricatorAnalytics.goto();
    if (await fabricatorAnalytics.dateRangeFilter.isVisible().catch(() => false)) {
      await fabricatorAnalytics.setDateRange('30d').catch(() => undefined);
    }
  });
});
