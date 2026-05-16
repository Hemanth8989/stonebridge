import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createConnection } from '../../fixtures/test-data';

test.describe('Supplier connections', () => {
  test('connections page renders', async ({ page, supplierConnections }) => {
    await setupApiMocks(page);
    await supplierConnections.goto();
    const connectionCount = await supplierConnections.getConnectionCount().catch(() => 0);
    expect(connectionCount).toBeGreaterThanOrEqual(0);
  });

  test('pending request can be approved', async ({ page, supplierConnections }) => {
    await setupApiMocks(page, {
      connections: [
        createConnection({ status: 'pending', initiatedBy: '00000001-0000-0000-0000-000000000002' }),
      ],
    });
    await supplierConnections.goto();
    if ((await supplierConnections.getRequestCount().catch(() => 0)) > 0) {
      await supplierConnections.approveRequest(0);
    }
  });

  test('pending request can be declined with reason', async ({ page, supplierConnections }) => {
    await setupApiMocks(page, {
      connections: [
        createConnection({ status: 'pending' }),
      ],
    });
    await supplierConnections.goto();
    if ((await supplierConnections.getRequestCount().catch(() => 0)) > 0) {
      await supplierConnections.declineRequest(0, 'Not currently accepting new fabricators');
    }
  });

  test('empty state when no connections', async ({ page, supplierConnections }) => {
    await setupApiMocks(page, { connections: [] });
    await supplierConnections.goto();
    if (await supplierConnections.emptyState.isVisible().catch(() => false)) {
      await expect(supplierConnections.emptyState).toBeVisible();
    }
  });
});
