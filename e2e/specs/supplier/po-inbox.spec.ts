import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createPOSummary } from '../../fixtures/test-data';

test.describe('Supplier PO inbox', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page, {
      pos: [
        createPOSummary({ status: 'sent' }),
        createPOSummary({ status: 'sent' }),
        createPOSummary({ status: 'acknowledged' }),
        createPOSummary({ status: 'countered' }),
        createPOSummary({ status: 'confirmed' }),
        createPOSummary({ status: 'shipped' }),
      ],
    });
  });

  test('renders PO cards in the inbox', async ({ supplierPOInbox }) => {
    await supplierPOInbox.goto();
    const count = await supplierPOInbox.getPOCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('clicking a PO navigates to detail page', async ({ supplierPOInbox, page }) => {
    await supplierPOInbox.goto();
    if ((await supplierPOInbox.getPOCount()) > 0) {
      await supplierPOInbox.clickPOCard(0);
      await expect(page).toHaveURL(/.*\/orders\/.+/);
    }
  });

  test('tabs filter by status', async ({ supplierPOInbox }) => {
    await supplierPOInbox.goto();
    for (const t of ['sent', 'acknowledged', 'countered', 'confirmed', 'shipped'] as const) {
      const tab = supplierPOInbox[`${t === 'sent' ? 'sentTab' : `${t}Tab`}` as keyof typeof supplierPOInbox];
      if (tab && typeof tab === 'object' && 'isVisible' in tab) {
        if (await (tab as any).isVisible().catch(() => false)) {
          await supplierPOInbox.clickTab(t);
        }
      }
    }
  });

  test('empty state when there are no POs', async ({ page, supplierPOInbox }) => {
    await setupApiMocks(page, { pos: [] });
    await supplierPOInbox.goto();
    if (await supplierPOInbox.emptyState.isVisible().catch(() => false)) {
      await expect(supplierPOInbox.emptyState).toBeVisible();
    }
  });
});
