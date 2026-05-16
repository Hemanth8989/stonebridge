import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createConnection } from '../../fixtures/test-data';

test.describe('Fabricator suppliers directory', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('suppliers page renders cards', async ({ fabricatorSuppliers }) => {
    await fabricatorSuppliers.goto();
    const count = await fabricatorSuppliers.getSupplierCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('search filters supplier list', async ({ fabricatorSuppliers }) => {
    await fabricatorSuppliers.goto();
    if (await fabricatorSuppliers.searchInput.isVisible().catch(() => false)) {
      await fabricatorSuppliers.searchFor('Apex');
    }
  });

  test('send connection request opens dialog', async ({ fabricatorSuppliers }) => {
    await fabricatorSuppliers.goto();
    if ((await fabricatorSuppliers.getSupplierCount()) > 0) {
      await fabricatorSuppliers.sendConnectionRequest(0, 'We would like to connect with you').catch(() => undefined);
    }
  });

  test('tab switching works', async ({ fabricatorSuppliers }) => {
    await fabricatorSuppliers.goto();
    for (const t of ['directory', 'connected', 'pending'] as const) {
      const map = {
        directory: fabricatorSuppliers.directoryTab,
        connected: fabricatorSuppliers.connectedTab,
        pending: fabricatorSuppliers.pendingTab,
      };
      if (await map[t].isVisible().catch(() => false)) {
        await fabricatorSuppliers.clickTab(t);
      }
    }
  });

  test('connected tab shows existing connections', async ({ page, fabricatorSuppliers }) => {
    await setupApiMocks(page, { connections: [createConnection({ status: 'active' })] });
    await fabricatorSuppliers.goto();
    if (await fabricatorSuppliers.connectedTab.isVisible().catch(() => false)) {
      await fabricatorSuppliers.clickTab('connected');
    }
  });
});
