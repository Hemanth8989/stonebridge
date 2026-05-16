import type {
  CatalogSlab, CatalogProduct, PurchaseOrder, POSummary,
  Connection, Job, Notification,
} from '@sb/types';

let idCounter = 1000;
export const nextId = (): string =>
  `00000000-0000-0000-0000-${String(++idCounter).padStart(12, '0')}`;

export const SUPPLIER_ID   = '00000001-0000-0000-0000-000000000001';
export const FABRICATOR_ID = '00000001-0000-0000-0000-000000000002';

export function createCatalogSlab(overrides: Partial<CatalogSlab> = {}): CatalogSlab {
  const id = nextId();
  const variantId = nextId();
  return {
    id,
    variantId,
    supplierId:       SUPPLIER_ID,
    bundleId:         null,
    internalRef:      `CAL-2026-${id.slice(-4)}`,
    barcode:          null,
    materialType:     'marble',
    materialName:     'Calacatta Gold',
    colorFamily:      'white',
    pattern:          'veined',
    originCountry:    'IT',
    quarryName:       'Apuan Alps',
    lotNumber:        'LOT-2026-A',
    blockNumber:      null,
    thicknessCm:      3,
    finish:           'polished',
    grossLengthMm:    3200,
    grossWidthMm:     1800,
    netSqft:          61.4,
    netSqm:           5.76,
    weightKg:         null,
    priceOverride:    420,
    warehouseId:      nextId(),
    rackLocation:     'A-02-L1',
    qualityGrade:     'A',
    status:           'available',
    statusChanged:    new Date().toISOString(),
    reservedForPo:    null,
    isActive:         true,
    isRemnant:        false,
    parentSlabId:     null,
    createdBy:        null,
    createdAt:        new Date().toISOString(),
    updatedAt:        new Date().toISOString(),
    supplierName:     'Apex Stone Co.',
    supplierVerified: true,
    productId:        nextId(),
    productName:      'Calacatta Gold Marble',
    sku:              `SKU-${id.slice(-4)}`,
    listPrice:        420,
    currency:         'USD',
    primaryPhotoUrl:  null,
    primaryThumbUrl:  null,
    photoCount:       0,
    warehouseCity:    'Atlanta',
    warehouseState:   'GA',
    ...overrides,
  };
}

export function createSlabCollection(count: number = 6): CatalogSlab[] {
  const materials: Array<{
    materialType: CatalogSlab['materialType'];
    materialName: string;
    color: CatalogSlab['colorFamily'];
  }> = [
    { materialType: 'marble',    materialName: 'Calacatta Gold', color: 'white' },
    { materialType: 'marble',    materialName: 'Statuario',      color: 'white' },
    { materialType: 'granite',   materialName: 'Black Galaxy',   color: 'black' },
    { materialType: 'quartzite', materialName: 'Super White',    color: 'white' },
    { materialType: 'granite',   materialName: 'Kashmir White',  color: 'cream' },
    { materialType: 'quartzite', materialName: 'Taj Mahal',      color: 'beige' },
  ];
  return Array.from({ length: count }, (_, i) => {
    const mat = materials[i % materials.length]!;
    return createCatalogSlab({
      materialType:  mat.materialType,
      materialName:  mat.materialName,
      colorFamily:   mat.color,
      priceOverride: 300 + i * 50,
      listPrice:     300 + i * 50,
    });
  });
}

export function createCatalogProduct(overrides: Partial<CatalogProduct> = {}): CatalogProduct {
  return {
    productId:        nextId(),
    supplierId:       SUPPLIER_ID,
    supplierName:     'Apex Stone Co.',
    supplierVerified: true,
    productCategory:  'blade',
    productName:      'Diamond Turbo Blade',
    brand:            'Weha',
    shortDescription: 'Professional 4" diamond turbo blade for granite and marble',
    specifications:   { diameter_mm: 100, arbor_mm: 22.23, max_rpm: 13300 },
    productStatus:    'active',
    variantId:        nextId(),
    sku:              'WEHA-TURBO-4',
    variantName:      '4" 1.6mm Turbo',
    attributes:       { diameter_mm: 100, thickness_mm: 1.6, segment: 'turbo' },
    unitOfMeasure:    'each',
    basePrice:        24.99,
    currency:         'USD',
    qtyAvailable:     48,
    qtyReserved:      2,
    variantStatus:    'available',
    leadTimeDays:     2,
    primaryPhotoUrl:  null,
    productCreatedAt: new Date().toISOString(),
    variantCreatedAt: new Date().toISOString(),
    ...overrides,
  };
}

export function createPOSummary(overrides: Partial<POSummary> = {}): POSummary {
  const id = nextId();
  const now = new Date();
  const sent = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  return {
    id,
    poNumber:          `PO-2026-${id.slice(-6)}`,
    fabricatorId:      FABRICATOR_ID,
    fabricatorName:    'Premier Countertops LLC',
    supplierId:        SUPPLIER_ID,
    supplierName:      'Apex Stone Co.',
    jobId:             null,
    jobName:           null,
    jobNumber:         null,
    status:            'sent',
    totalAmount:       1680,
    currency:          'USD',
    requestedDelivery: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    confirmedDelivery: null,
    sentAt:            sent.toISOString(),
    ackedAt:           null,
    shippedAt:         null,
    receivedAt:        null,
    totalLines:        4,
    confirmedLines:    0,
    declinedLines:     0,
    pendingLines:      4,
    ackHours:          null,
    createdAt:         sent.toISOString(),
    updatedAt:         sent.toISOString(),
    ...overrides,
  };
}

export function createPurchaseOrder(overrides: Partial<PurchaseOrder> = {}): PurchaseOrder {
  const slab = createCatalogSlab();
  const summary = createPOSummary(overrides as Partial<POSummary>);
  return {
    id:               summary.id,
    poNumber:         summary.poNumber,
    fabricatorId:     summary.fabricatorId,
    supplierId:       summary.supplierId,
    jobId:            summary.jobId,
    status:           summary.status,
    statusChanged:    new Date().toISOString(),
    subtotal:         1680,
    discountAmount:   0,
    taxAmount:        0,
    shippingAmount:   0,
    totalAmount:      1680,
    currency:         'USD',
    deliveryAddressId: null,
    requestedDelivery: summary.requestedDelivery,
    confirmedDelivery: null,
    trackingNumber:   null,
    carrier:          null,
    shippedAt:        null,
    receivedAt:       null,
    fabricatorNotes:  'Please handle with care',
    supplierNotes:    null,
    internalRef:      'Kitchen renovation - 123 Oak St',
    counterOffer:     null,
    syncedToMoraware: false,
    morawarePoId:     null,
    createdBy:        FABRICATOR_ID,
    sentAt:           summary.sentAt,
    ackedAt:          summary.ackedAt,
    lineItems: [
      {
        id:            nextId(),
        poId:          summary.id,
        variantId:     slab.variantId,
        slabId:        slab.id,
        itemSnapshot: {
          slabId:          slab.id,
          internalRef:     slab.internalRef,
          materialName:    slab.materialName,
          materialType:    slab.materialType,
          thicknessCm:     slab.thicknessCm,
          finish:          slab.finish,
          grossLengthMm:   slab.grossLengthMm,
          grossWidthMm:    slab.grossWidthMm,
          netSqft:         slab.netSqft,
          rackLocation:    slab.rackLocation,
          qualityGrade:    slab.qualityGrade,
          primaryPhotoUrl: null,
          barcode:         null,
        },
        quantity:          1,
        unitOfMeasure:     'each',
        unitPrice:         420,
        lineTotal:         420,
        currency:          'USD',
        status:            'pending',
        declineReason:     null,
        substituteVariant: null,
        substituteSlab:    null,
        counterPrice:      null,
        counterNote:       null,
        qtyReceived:       null,
        receivedCondition: null,
        discrepancyNote:   null,
        discrepancyPhotos: null,
        createdAt:         new Date().toISOString(),
        updatedAt:         new Date().toISOString(),
      },
    ],
    createdAt: summary.createdAt,
    updatedAt: summary.updatedAt,
    ...overrides,
  };
}

export function createConnection(overrides: Partial<Connection> = {}): Connection {
  return {
    id:              nextId(),
    fabricatorId:    FABRICATOR_ID,
    supplierId:      SUPPLIER_ID,
    status:          'active',
    pricingTier:     'standard',
    initiatedBy:     FABRICATOR_ID,
    approvedBy:      SUPPLIER_ID,
    requestMessage:  null,
    declineReason:   null,
    fabricatorNotes: null,
    requestedAt:     new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    connectedAt:     new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    suspendedAt:     null,
    terminatedAt:    null,
    ...overrides,
  };
}

export function createJob(overrides: Partial<Job> = {}): Job {
  const id = nextId();
  return {
    id,
    fabricatorId:    FABRICATOR_ID,
    jobNumber:       `JOB-2026-${id.slice(-4)}`,
    customerName:    'Sarah Johnson',
    customerEmail:   'sarah@example.com',
    customerPhone:   '555-0100',
    jobName:         'Kitchen Renovation - 145 Elm Street',
    status:          'approved',
    templateDate:    null,
    fabricationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    installDate:     new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    materialBudget:  3500,
    totalOrdered:    1680,
    totalReceived:   0,
    morawareJobId:   null,
    actionflowJobId: null,
    notes:           null,
    createdBy:       FABRICATOR_ID,
    createdAt:       new Date().toISOString(),
    updatedAt:       new Date().toISOString(),
    ...overrides,
  };
}

export function createNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id:         nextId(),
    tenantId:   SUPPLIER_ID,
    userId:     null,
    eventId:    null,
    type:       'po_acknowledged',
    title:      'PO acknowledged',
    body:       'PO-2026-000001 has been acknowledged by Premier Countertops',
    entityType: 'purchase_order',
    entityId:   nextId(),
    linkUrl:    '/orders/po-id',
    isRead:     false,
    readAt:     null,
    createdAt:  new Date().toISOString(),
    ...overrides,
  };
}

export function pagedResponse<T>(items: T[], page = 1, perPage = 24): object {
  return {
    data: items,
    meta: { totalCount: items.length, page, perPage, hasNextPage: false },
  };
}

export function singleResponse<T>(item: T): object {
  return { data: item };
}
