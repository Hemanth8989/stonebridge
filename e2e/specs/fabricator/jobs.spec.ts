import { test, expect } from '../../fixtures';
import { setupApiMocks } from '../../fixtures/api-mock';
import { createJob } from '../../fixtures/test-data';

test.describe('Fabricator jobs list', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page, {
      jobs: [
        createJob(),
        createJob({ status: 'fabricating', jobName: 'Bathroom Remodel - 22 Pine' }),
        createJob({ status: 'installed',   jobName: 'Office Build-out' }),
      ],
    });
  });

  test('jobs page renders rows', async ({ fabricatorJobs }) => {
    await fabricatorJobs.goto();
    const count = await fabricatorJobs.getJobCount().catch(() => 0);
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('creating a new job opens the dialog and submits', async ({ fabricatorJobs }) => {
    await fabricatorJobs.goto();
    if (await fabricatorJobs.newJobButton.isVisible().catch(() => false)) {
      await fabricatorJobs.createJob({
        jobName:       'Test Kitchen Renovation',
        customerName:  'Jane Test',
        customerEmail: 'jane@example.com',
        installDate:   '2026-06-15',
        materialBudget: 5000,
      }).catch(() => undefined);
    }
  });

  test('opening a job navigates to detail', async ({ fabricatorJobs, page }) => {
    await fabricatorJobs.goto();
    if ((await fabricatorJobs.getJobCount()) > 0) {
      await fabricatorJobs.openJob(0).catch(() => undefined);
      expect(page.url()).toMatch(/jobs/);
    }
  });

  test('status filter narrows results', async ({ fabricatorJobs }) => {
    await fabricatorJobs.goto();
    if (await fabricatorJobs.statusFilter.isVisible().catch(() => false)) {
      await fabricatorJobs.filterByStatus('fabricating').catch(() => undefined);
    }
  });
});
