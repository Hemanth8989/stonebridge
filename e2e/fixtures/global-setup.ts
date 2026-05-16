import { chromium, type FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {
  injectSupplierAuth,
  injectFabricatorAuth,
  saveSupplierAuthState,
  saveFabricatorAuthState,
} from './auth';

async function globalSetup(_config: FullConfig): Promise<void> {
  const authDir = path.join(process.cwd(), 'e2e', '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();

  const supplierContext = await browser.newContext();
  const supplierPage    = await supplierContext.newPage();
  try {
    await injectSupplierAuth(supplierPage);
    await supplierPage.goto('http://localhost:5174/dashboard');
    await supplierPage.waitForLoadState('networkidle').catch(() => undefined);
    await saveSupplierAuthState(supplierContext);
  } finally {
    await supplierContext.close();
  }

  const fabricatorContext = await browser.newContext();
  const fabricatorPage    = await fabricatorContext.newPage();
  try {
    await injectFabricatorAuth(fabricatorPage);
    await fabricatorPage.goto('http://localhost:5173/dashboard');
    await fabricatorPage.waitForLoadState('networkidle').catch(() => undefined);
    await saveFabricatorAuthState(fabricatorContext);
  } finally {
    await fabricatorContext.close();
  }

  await browser.close();
}

export default globalSetup;
