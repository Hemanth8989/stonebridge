import type { Page, Route } from '@playwright/test';
import {
  createCatalogSlab, createSlabCollection, createCatalogProduct,
  createPOSummary, createPurchaseOrder, createConnection,
  createJob, createNotification, pagedResponse, singleResponse,
  SUPPLIER_ID, FABRICATOR_ID,
} from './test-data';

type RouteHandler = (route: Route) => Promise<void> | void;

export interface ApiMockOverrides {
  slabs:         ReturnType<typeof createCatalogSlab>[];
  products:      ReturnType<typeof createCatalogProduct>[];
  pos:           ReturnType<typeof createPOSummary>[];
  connections:   ReturnType<typeof createConnection>[];
  jobs:          ReturnType<typeof createJob>[];
  notifications: ReturnType<typeof createNotification>[];
}

export async function setupApiMocks(
  page: Page,
  overrides: Partial<ApiMockOverrides> = {},
): Promise<void> {
  const mocks = buildDefaultMocks(overrides);
  for (const [pattern, handler] of Object.entries(mocks)) {
    await page.route(pattern, handler);
  }
}

function buildDefaultMocks(overrides: Partial<ApiMockOverrides>): Record<string, RouteHandler> {
  const slabs       = overrides.slabs       ?? createSlabCollection(6);
  const products    = overrides.products    ?? [
    createCatalogProduct(),
    createCatalogProduct({
      productCategory: 'adhesive',
      productName:     'Tenax Tefill Kit',
      brand:           'Tenax',
      basePrice:       18.99,
    }),
  ];
  const pos         = overrides.pos         ?? [
    createPOSummary({ status: 'sent' }),
    createPOSummary({ status: 'acknowledged' }),
    createPOSummary({ status: 'confirmed' }),
  ];
  const connections = overrides.connections ?? [createConnection()];
  const jobs        = overrides.jobs        ?? [createJob()];
  const notifications = overrides.notifications ?? [
    createNotification(),
    createNotification({ isRead: true }),
  ];
  const singleSlab = slabs[0]!;
  const singlePO   = createPurchaseOrder({
    id: pos[0]!.id,
    poNumber: pos[0]!.poNumber,
  });

  return {
    '**/api/v1/catalog/slabs?**': async (route) => {
      await route.fulfill({ json: pagedResponse(slabs), status: 200 });
    },
    '**/api/v1/catalog/slabs/*': async (route) => {
      await route.fulfill({ json: singleResponse(singleSlab), status: 200 });
    },
    '**/api/v1/supplier/slabs?**': async (route) => {
      await route.fulfill({ json: pagedResponse(slabs), status: 200 });
    },
    '**/api/v1/supplier/slabs': async (route) => {
      if (route.request().method() === 'POST') {
        const newSlab = createCatalogSlab();
        await route.fulfill({ json: singleResponse(newSlab.id), status: 201 });
      } else {
        await route.fulfill({ json: pagedResponse(slabs), status: 200 });
      }
    },
    '**/api/v1/supplier/slabs/**/status': async (route) => {
      await route.fulfill({ status: 204 });
    },
    '**/api/v1/supplier/slabs/**': async (route) => {
      const method = route.request().method();
      if (method === 'DELETE' || method === 'PATCH' || method === 'PUT') {
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({ json: singleResponse(singleSlab), status: 200 });
      }
    },
    '**/api/v1/catalog/products?**': async (route) => {
      await route.fulfill({ json: pagedResponse(products), status: 200 });
    },
    '**/api/v1/catalog/products/**': async (route) => {
      await route.fulfill({ json: singleResponse(products[0]!), status: 200 });
    },
    '**/api/v1/pos?**': async (route) => {
      await route.fulfill({ json: pagedResponse(pos), status: 200 });
    },
    '**/api/v1/pos/**/acknowledge': async (route) => {
      await route.fulfill({ json: singleResponse({ ...singlePO, status: 'acknowledged' }), status: 200 });
    },
    '**/api/v1/pos/**/counter': async (route) => {
      await route.fulfill({ json: singleResponse({ ...singlePO, status: 'countered' }), status: 200 });
    },
    '**/api/v1/pos/**/cancel': async (route) => {
      await route.fulfill({ json: singleResponse({ ...singlePO, status: 'cancelled' }), status: 200 });
    },
    '**/api/v1/pos/**/ship': async (route) => {
      await route.fulfill({ json: singleResponse({ ...singlePO, status: 'shipped' }), status: 200 });
    },
    '**/api/v1/pos/**/confirm-received': async (route) => {
      await route.fulfill({ json: singleResponse({ ...singlePO, status: 'received' }), status: 200 });
    },
    '**/api/v1/pos/*': async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: singleResponse(singlePO), status: 201 });
      } else {
        await route.fulfill({ json: singleResponse(singlePO), status: 200 });
      }
    },
    '**/api/v1/pos': async (route) => {
      await route.fulfill({ json: singleResponse(singlePO), status: 201 });
    },
    '**/api/v1/connections/directory': async (route) => {
      await route.fulfill({
        json: { data: connections.map((c) => ({ ...c, displayName: 'Apex Stone Co.', verified: true })) },
        status: 200,
      });
    },
    '**/api/v1/connections/requests': async (route) => {
      await route.fulfill({ json: { data: [] }, status: 200 });
    },
    '**/api/v1/connections/**/approve': async (route) => {
      await route.fulfill({ json: singleResponse({ ...connections[0]!, status: 'active' }), status: 200 });
    },
    '**/api/v1/connections/**/decline': async (route) => {
      await route.fulfill({ json: singleResponse({ ...connections[0]!, status: 'declined' }), status: 200 });
    },
    '**/api/v1/connections': async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          json: singleResponse(createConnection({ status: 'pending' })),
          status: 201,
        });
      } else {
        await route.fulfill({ json: { data: connections }, status: 200 });
      }
    },
    '**/api/v1/jobs/**/pos': async (route) => {
      await route.fulfill({ json: pagedResponse(pos), status: 200 });
    },
    '**/api/v1/jobs/**': async (route) => {
      await route.fulfill({ json: singleResponse(jobs[0]!), status: 200 });
    },
    '**/api/v1/jobs': async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: singleResponse(createJob()), status: 201 });
      } else {
        await route.fulfill({ json: pagedResponse(jobs), status: 200 });
      }
    },
    '**/api/v1/notifications/read-all': async (route) => {
      await route.fulfill({ status: 204 });
    },
    '**/api/v1/notifications/**/read': async (route) => {
      await route.fulfill({ status: 204 });
    },
    '**/api/v1/notifications/preferences': async (route) => {
      await route.fulfill({
        json: singleResponse({
          po_acknowledged: { email: true,  in_app: true,  sms: false },
          po_declined:     { email: true,  in_app: true,  sms: true  },
          po_countered:    { email: true,  in_app: true,  sms: true  },
          price_changed:   { email: true,  in_app: false, sms: false },
          new_stock:       { email: false, in_app: true,  sms: false },
          po_unacked_24h:  { email: true,  in_app: true,  sms: false },
        }),
        status: 200,
      });
    },
    '**/api/v1/notifications': async (route) => {
      await route.fulfill({ json: pagedResponse(notifications), status: 200 });
    },
    '**/api/v1/analytics/supplier': async (route) => {
      await route.fulfill({
        json: singleResponse({
          revenueByMonth: [
            { month: 'Jan', revenue: 12400 },
            { month: 'Feb', revenue: 18600 },
            { month: 'Mar', revenue: 22100 },
            { month: 'Apr', revenue: 19800 },
            { month: 'May', revenue: 31200 },
          ],
          topBuyers: [{
            fabricatorId:   FABRICATOR_ID,
            fabricatorName: 'Premier Countertops',
            totalSpend:     31200,
            poCount:        14,
          }],
          avgResponseHrs:  3.2,
          fulfillmentRate: 96.4,
          inventoryAging: [{
            slabId:       slabs[0]!.id,
            materialName: 'Bianco Romano',
            internalRef:  'BIO-001',
            daysInStock:  95,
            listPrice:    310,
          }],
        }),
        status: 200,
      });
    },
    '**/api/v1/analytics/fabricator': async (route) => {
      await route.fulfill({
        json: singleResponse({
          spendBySupplier: [{
            supplierId:   SUPPLIER_ID,
            supplierName: 'Apex Stone Co.',
            totalSpend:   31200,
            poCount:      14,
          }],
          avgLeadTimeBySupplier: [{
            supplierId:        SUPPLIER_ID,
            supplierName:      'Apex Stone Co.',
            publishedLeadDays: 5,
            actualAvgDays:     4.8,
          }],
          materialCosts: [{
            materialType:    'marble',
            avgPricePerSqft: 38.50,
            totalSqft:       812,
            totalSpend:      31260,
          }],
        }),
        status: 200,
      });
    },
  };
}

export async function mockRoute(
  page: Page,
  pattern: string,
  response: object,
  status = 200,
): Promise<void> {
  await page.route(pattern, async (route) => {
    await route.fulfill({ json: response, status });
  });
}

export async function mockRouteOnce(
  page: Page,
  pattern: string,
  response: object,
  status = 200,
): Promise<void> {
  await page.route(pattern, async (route: Route) => {
    await route.fulfill({ json: response, status });
  }, { times: 1 });
}

export async function mockRouteError(
  page: Page,
  pattern: string,
  status = 500,
  body: object = { error: 'Internal Server Error' },
): Promise<void> {
  await page.route(pattern, async (route) => {
    await route.fulfill({ json: body, status });
  });
}
