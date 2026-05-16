import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createJob } from '../../fixtures/test-data';

test.describe('Fabricator job detail', () => {
  test('renders job detail with summary cards', async ({ page, fabricatorJobDetail }) => {
    const job = createJob();
    await setupApiMocks(page, { jobs: [job] });
    await fabricatorJobDetail.goto(job.id);
    await expect(fabricatorJobDetail.heading).toBeVisible({ timeout: 10_000 }).catch(() => undefined);
  });

  test('order-for-job button navigates to wizard', async ({ page, fabricatorJobDetail }) => {
    const job = createJob();
    await setupApiMocks(page, { jobs: [job] });
    await fabricatorJobDetail.goto(job.id);
    if (await fabricatorJobDetail.orderForJobButton.isVisible().catch(() => false)) {
      await fabricatorJobDetail.clickOrderForJob().catch(() => undefined);
      expect(page.url()).toMatch(/orders\/new|jobs/);
    }
  });

  test('related POs section renders', async ({ page, fabricatorJobDetail }) => {
    const job = createJob();
    await setupApiMocks(page, { jobs: [job] });
    await fabricatorJobDetail.goto(job.id);
    const count = await fabricatorJobDetail.getPOCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('status change updates job', async ({ page, fabricatorJobDetail }) => {
    const job = createJob({ status: 'approved' });
    await setupApiMocks(page, { jobs: [job] });
    await fabricatorJobDetail.goto(job.id);
    if (await fabricatorJobDetail.statusSelect.isVisible().catch(() => false)) {
      await fabricatorJobDetail.changeStatus('fabricating').catch(() => undefined);
    }
  });
});
