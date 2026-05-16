import type { Page, BrowserContext } from '@playwright/test';

export const SUPPLIER_AUTH = {
  tenantId:   '00000001-0000-0000-0000-000000000001',
  tenantType: 'supplier' as const,
  userId:     '00000001-0000-0000-0000-000000000010',
  name:       'Apex Stone Co.',
  email:      'admin@apexstone.com',
};

export const FABRICATOR_AUTH = {
  tenantId:   '00000001-0000-0000-0000-000000000002',
  tenantType: 'fabricator' as const,
  userId:     '00000001-0000-0000-0000-000000000020',
  name:       'Premier Countertops LLC',
  email:      'admin@premiercountertops.com',
};

export async function injectSupplierAuth(page: Page): Promise<void> {
  await page.goto('http://localhost:5174');
  await page.evaluate((auth) => {
    localStorage.setItem('sb_token', `fake-supplier-token-${auth.tenantId}`);
    localStorage.setItem('sb-supplier-auth', JSON.stringify({
      state: {
        user:   { id: auth.userId, email: auth.email, fullName: auth.name, role: 'owner', tenantId: auth.tenantId },
        tenant: { id: auth.tenantId, type: auth.tenantType, name: auth.name, slug: 'apex-stone', plan: 'pro' },
        token:  `fake-supplier-token-${auth.tenantId}`,
        isAuthenticated: true,
      },
      version: 0,
    }));
  }, SUPPLIER_AUTH);
}

export async function injectFabricatorAuth(page: Page): Promise<void> {
  await page.goto('http://localhost:5173');
  await page.evaluate((auth) => {
    localStorage.setItem('sb_token', `fake-fabricator-token-${auth.tenantId}`);
    localStorage.setItem('sb-fabricator-auth', JSON.stringify({
      state: {
        user:   { id: auth.userId, email: auth.email, fullName: auth.name, role: 'owner', tenantId: auth.tenantId },
        tenant: { id: auth.tenantId, type: auth.tenantType, name: auth.name, slug: 'premier-ctops', plan: 'starter' },
        token:  `fake-fabricator-token-${auth.tenantId}`,
        isAuthenticated: true,
      },
      version: 0,
    }));
  }, FABRICATOR_AUTH);
}

export async function saveSupplierAuthState(context: BrowserContext): Promise<void> {
  await context.storageState({ path: 'e2e/.auth/supplier.json' });
}

export async function saveFabricatorAuthState(context: BrowserContext): Promise<void> {
  await context.storageState({ path: 'e2e/.auth/fabricator.json' });
}

export async function clearAuth(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb-supplier-auth');
    localStorage.removeItem('sb-fabricator-auth');
  });
}
