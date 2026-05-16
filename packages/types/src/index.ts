// @sb/types — shared domain types for StoneBridge apps and packages

/** Tenant classification for multi-tenant routing and UI. */
export type TenantType = 'fabricator' | 'supplier';

/** Subscription / entitlement tier. */
export type PlanTier = 'trial' | 'starter' | 'pro' | 'enterprise';

/** Role within a tenant for RBAC. */
export type UserRole = 'owner' | 'admin' | 'manager' | 'viewer';

/** Inventory lifecycle state for a slab unit. */
export type SlabStatus =
  | 'available'
  | 'reserved'
  | 'allocated'
  | 'shipped'
  | 'hold'
  | 'sold';

/** Purchase order lifecycle state. */
export type POStatus =
  | 'draft'
  | 'sent'
  | 'acknowledged'
  | 'partially_acked'
  | 'countered'
  | 'confirmed'
  | 'shipped'
  | 'received'
  | 'closed'
  | 'disputed'
  | 'cancelled';

/** Line-level acknowledgement outcome on a PO line item. */
export type LineStatus =
  | 'pending'
  | 'confirmed'
  | 'declined'
  | 'substituted'
  | 'received';

/** Fabricator job lifecycle. */
export type JobStatus =
  | 'quoted'
  | 'approved'
  | 'templated'
  | 'fabricating'
  | 'ready'
  | 'installed'
  | 'closed'
  | 'cancelled';

/** Supplier–fabricator commercial connection state. */
export type ConnStatus = 'pending' | 'active' | 'suspended' | 'declined' | 'terminated';

/** Pricing relationship tier between connected parties. */
export type PricingTier = 'standard' | 'preferred' | 'vip';

/** Broad stone / surface material classification. */
export type MaterialType =
  | 'granite'
  | 'marble'
  | 'quartzite'
  | 'quartz'
  | 'porcelain'
  | 'dekton'
  | 'limestone'
  | 'travertine'
  | 'onyx'
  | 'slate'
  | 'soapstone'
  | 'other';

/** Normalized color grouping for search and display. */
export type ColorFamily =
  | 'white'
  | 'cream'
  | 'beige'
  | 'gray'
  | 'charcoal'
  | 'black'
  | 'blue'
  | 'green'
  | 'red'
  | 'brown'
  | 'gold'
  | 'multi';

/** Surface finish on slab material. */
export type SlabFinish =
  | 'polished'
  | 'honed'
  | 'leathered'
  | 'brushed'
  | 'sandblasted'
  | 'flamed'
  | 'natural';

/** Supplier-assigned visual / structural grade. */
export type QualityGrade = 'A' | 'B' | 'C';

/** Units for ordering and fulfillment. */
export type UnitOfMeasure =
  | 'each'
  | 'sq_ft'
  | 'sq_m'
  | 'linear_ft'
  | 'linear_m'
  | 'liter'
  | 'gallon'
  | 'kg'
  | 'lb'
  | 'box'
  | 'case'
  | 'roll'
  | 'bag'
  | 'pair'
  | 'set';

/** Tooling / supply taxonomy for non-slab SKUs. */
export type ProductCategory =
  | 'slab'
  | 'blade'
  | 'bit'
  | 'wheel'
  | 'pad'
  | 'sink'
  | 'faucet_hole_template'
  | 'bracket'
  | 'clip'
  | 'adhesive'
  | 'sealer'
  | 'cleaner'
  | 'colorant'
  | 'abrasive'
  | 'edge_profile_template'
  | 'backsplash_tile'
  | 'trim'
  | 'ppe'
  | 'dust_collection'
  | 'packaging'
  | 'tool'
  | 'equipment'
  | 'other';

/** Variant availability snapshot for storefront / PO UX. */
export type VariantStatus = 'available' | 'low_stock' | 'out_of_stock' | 'discontinued';

/** Parent product publish state. */
export type ProductStatus = 'active' | 'inactive' | 'discontinued' | 'backordered';

/** Async integration / webhook delivery outcome. */
export type EventStatus = 'pending' | 'delivered' | 'failed' | 'dead_letter';

/** User-facing notification taxonomy. */
export type NotifType =
  | 'po_acknowledged'
  | 'po_declined'
  | 'po_countered'
  | 'slab_reserved_by_other'
  | 'price_changed'
  | 'new_stock'
  | 'po_unacked_24h'
  | 'delivery_confirmed'
  | 'connection_approved'
  | 'low_stock_warning';

/** Goods receipt quality classification. */
export type ReceivedCondition =
  | 'perfect'
  | 'minor_damage'
  | 'major_damage'
  | 'wrong_item'
  | 'short_shipped';

/** Fabricator shop scale for segmentation. */
export type ShopSize = 'solo' | 'small' | 'medium' | 'large' | 'enterprise';

/** Sort direction for list queries. */
export type SortDir = 'ASC' | 'DESC';

/** Slab catalog sort fields. */
export type SlabSortBy = 'updated_at' | 'list_price' | 'net_sqft';

/** Root tenant record (supplier or fabricator). */
export interface Tenant {
  id: string;
  type: TenantType;
  name: string;
  slug: string;
  plan: PlanTier;
  planStartedAt: string | null;
  planExpiresAt: string | null;
  stripeCid: string | null;
  billingEmail: string | null;
  country: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Human user belonging to a tenant. */
export interface User {
  id: string;
  tenantId: string;
  email: string;
  fullName: string;
  role: UserRole;
  authUid: string | null;
  phone: string | null;
  avatarUrl: string | null;
  lastLogin: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Supplier-facing public profile and KPIs. */
export interface SupplierProfile {
  tenantId: string;
  displayName: string;
  logoUrl: string | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  addressLine1: string | null;
  city: string | null;
  stateProvince: string | null;
  postalCode: string | null;
  country: string;
  establishedYear: number | null;
  warehouseCount: number;
  verified: boolean;
  avgLeadDays: number | null;
  fulfillmentRate: number | null;
  avgResponseHrs: number | null;
  totalSlabsSold: number;
  createdAt: string;
  updatedAt: string;
}

/** Per-channel toggles for fabricator notifications. */
export interface NotificationPrefs {
  po_acknowledged: { email: boolean; in_app: boolean; sms: boolean };
  po_declined: { email: boolean; in_app: boolean; sms: boolean };
  po_countered: { email: boolean; in_app: boolean; sms: boolean };
  price_changed: { email: boolean; in_app: boolean; sms: boolean };
  new_stock: { email: boolean; in_app: boolean; sms: boolean };
  po_unacked_24h: { email: boolean; in_app: boolean; sms: boolean };
}

/** Fabricator-facing profile and integration hooks. */
export interface FabricatorProfile {
  tenantId: string;
  displayName: string;
  logoUrl: string | null;
  description: string | null;
  phone: string | null;
  city: string | null;
  stateProvince: string | null;
  country: string;
  shopSize: ShopSize | null;
  monthlyJobVolume: number | null;
  morawareShopId: string | null;
  actionflowId: string | null;
  notificationPrefs: NotificationPrefs;
  createdAt: string;
  updatedAt: string;
}

/** Supplier fulfillment location. */
export interface Warehouse {
  id: string;
  supplierId: string;
  name: string;
  addressLine1: string | null;
  city: string | null;
  stateProvince: string | null;
  postalCode: string | null;
  country: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
}

/** Saved ship-to / bill-to for a tenant. */
export interface Address {
  id: string;
  tenantId: string;
  label: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

/** Logical grouping of slabs from the same inbound shipment / lot context. */
export interface SlabBundle {
  id: string;
  supplierId: string;
  bundleRef: string;
  materialName: string;
  quarryName: string | null;
  originCountry: string | null;
  arrivalDate: string | null;
  invoiceRef: string | null;
  notes: string | null;
  slabCount: number;
  activeCount: number;
  createdAt: string;
}

/** Single physical slab inventory unit. */
export interface Slab {
  id: string;
  variantId: string;
  supplierId: string;
  bundleId: string | null;
  internalRef: string;
  barcode: string | null;
  materialType: MaterialType;
  materialName: string;
  colorFamily: ColorFamily | null;
  pattern: string | null;
  originCountry: string | null;
  quarryName: string | null;
  lotNumber: string | null;
  blockNumber: string | null;
  thicknessCm: number;
  finish: SlabFinish;
  grossLengthMm: number;
  grossWidthMm: number;
  netSqft: number;
  netSqm: number;
  weightKg: number | null;
  priceOverride: number | null;
  warehouseId: string | null;
  rackLocation: string | null;
  qualityGrade: QualityGrade;
  status: SlabStatus;
  statusChanged: string;
  reservedForPo: string | null;
  isActive: boolean;
  isRemnant: boolean;
  parentSlabId: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Marketing / QC imagery attached to a slab. */
export interface SlabPhoto {
  id: string;
  slabId: string;
  url: string;
  thumbUrl: string | null;
  cdnUrl: string | null;
  photoType: 'front' | 'back' | 'edge' | 'detail' | 'installed' | 'vein';
  sortOrder: number;
  widthPx: number | null;
  heightPx: number | null;
  sizeBytes: number | null;
  uploadedBy: string | null;
  createdAt: string;
}

/** Sellable product (may fan out to variants). */
export interface Product {
  id: string;
  supplierId: string;
  categoryId: string | null;
  productCategory: ProductCategory;
  name: string;
  skuPrefix: string | null;
  brand: string | null;
  manufacturer: string | null;
  description: string | null;
  shortDescription: string | null;
  specifications: Record<string, unknown>;
  tags: string[];
  packageLengthMm: number | null;
  packageWidthMm: number | null;
  packageHeightMm: number | null;
  packageWeightKg: number | null;
  status: ProductStatus;
  isActive: boolean;
  isSlabProduct: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Concrete SKU / sellable variant row. */
export interface ProductVariant {
  id: string;
  productId: string;
  supplierId: string;
  sku: string;
  name: string;
  attributes: Record<string, unknown>;
  unitOfMeasure: UnitOfMeasure;
  basePrice: number;
  currency: string;
  qtyAvailable: number;
  qtyReserved: number;
  qtyOnOrder: number;
  reorderPoint: number;
  reorderQty: number;
  status: VariantStatus;
  warehouseId: string | null;
  binLocation: string | null;
  isActive: boolean;
  isSlabVariant: boolean;
  leadTimeDays: number | null;
  barcode: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Relationship graph edge between fabricator and supplier tenants. */
export interface Connection {
  id: string;
  fabricatorId: string;
  supplierId: string;
  status: ConnStatus;
  pricingTier: PricingTier;
  initiatedBy: string | null;
  approvedBy: string | null;
  requestMessage: string | null;
  declineReason: string | null;
  fabricatorNotes: string | null;
  requestedAt: string;
  connectedAt: string | null;
  suspendedAt: string | null;
  terminatedAt: string | null;
}

/** Fabricator installation job driving material demand. */
export interface Job {
  id: string;
  fabricatorId: string;
  jobNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  jobName: string;
  status: JobStatus;
  templateDate: string | null;
  fabricationDate: string | null;
  installDate: string | null;
  materialBudget: number | null;
  totalOrdered: number;
  totalReceived: number;
  morawareJobId: string | null;
  actionflowJobId: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Immutable-ish slab facts stamped onto a PO line for disputes/history. */
export interface SlabSnapshot {
  slabId: string;
  internalRef: string;
  materialName: string;
  materialType: MaterialType;
  thicknessCm: number;
  finish: SlabFinish;
  grossLengthMm: number;
  grossWidthMm: number;
  netSqft: number;
  rackLocation: string | null;
  qualityGrade: QualityGrade;
  primaryPhotoUrl: string | null;
  barcode: string | null;
}

/** Immutable-ish product facts stamped onto a PO line. */
export interface ProductSnapshot {
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  variantName: string;
  attributes: Record<string, unknown>;
  unitOfMeasure: UnitOfMeasure;
  brand: string | null;
  primaryPhotoUrl: string | null;
}

/** Single row on a purchase order. */
export interface POLineItem {
  id: string;
  poId: string;
  variantId: string;
  slabId: string | null;
  itemSnapshot: SlabSnapshot | ProductSnapshot;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  status: LineStatus;
  declineReason: string | null;
  substituteVariant: string | null;
  substituteSlab: string | null;
  counterPrice: number | null;
  counterNote: string | null;
  qtyReceived: number | null;
  receivedCondition: ReceivedCondition | null;
  discrepancyNote: string | null;
  discrepancyPhotos: Array<{ url: string; description: string }> | null;
  createdAt: string;
  updatedAt: string;
}

/** Supplier-side counter terms against an open PO. */
export interface CounterOffer {
  proposedDelivery: string | null;
  supplierNote: string | null;
  lineChanges: Array<{
    lineItemId: string;
    originalPrice: number;
    proposedPrice: number;
    reason: string;
  }>;
}

/** Purchase order aggregate root. */
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  fabricatorId: string;
  supplierId: string;
  jobId: string | null;
  status: POStatus;
  statusChanged: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  deliveryAddressId: string | null;
  requestedDelivery: string | null;
  confirmedDelivery: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  shippedAt: string | null;
  receivedAt: string | null;
  fabricatorNotes: string | null;
  supplierNotes: string | null;
  internalRef: string | null;
  counterOffer: CounterOffer | null;
  syncedToMoraware: boolean;
  morawarePoId: string | null;
  createdBy: string | null;
  sentAt: string | null;
  ackedAt: string | null;
  lineItems: POLineItem[];
  createdAt: string;
  updatedAt: string;
}

/** User-visible notification envelope. */
export interface Notification {
  id: string;
  tenantId: string;
  userId: string | null;
  eventId: string | null;
  type: NotifType;
  title: string;
  body: string;
  entityType: string | null;
  entityId: string | null;
  linkUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

/** Outbox-style sync event for integrations. */
export interface SyncEvent {
  id: string;
  eventType: string;
  sourceTenant: string;
  targetTenant: string | null;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  status: EventStatus;
  attemptCount: number;
  lastAttempt: string | null;
  deliveredAt: string | null;
  nextRetryAt: string | null;
  idempotencyKey: string | null;
  createdAt: string;
}

/** External system connector configuration. */
export interface Integration {
  id: string;
  tenantId: string;
  integrationType: 'moraware' | 'actionflow' | 'slabware' | 'quickbooks' | 'custom';
  displayName: string;
  externalShopId: string | null;
  webhookUrl: string | null;
  apiEndpoint: string | null;
  config: Record<string, unknown>;
  isActive: boolean;
  lastSync: string | null;
  lastSyncStatus: 'success' | 'failed' | 'partial' | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Tenant-configured outbound webhook subscription. */
export interface WebhookEndpoint {
  id: string;
  tenantId: string;
  url: string;
  description: string | null;
  secret: string;
  eventFilter: string[];
  isActive: boolean;
  totalSent: number;
  totalFailed: number;
  lastSuccess: string | null;
  lastFailure: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Fabricator catalog slab row with supplier enrichment. */
export interface CatalogSlab extends Slab {
  supplierName: string;
  supplierVerified: boolean;
  productId: string;
  productName: string;
  sku: string;
  listPrice: number;
  currency: string;
  primaryPhotoUrl: string | null;
  primaryThumbUrl: string | null;
  photoCount: number;
  warehouseCity: string | null;
  warehouseState: string | null;
}

/** Flattened product + variant row for catalog grids. */
export interface CatalogProduct {
  productId: string;
  supplierId: string;
  supplierName: string;
  supplierVerified: boolean;
  productCategory: ProductCategory;
  productName: string;
  brand: string | null;
  shortDescription: string | null;
  specifications: Record<string, unknown>;
  productStatus: ProductStatus;
  variantId: string;
  sku: string;
  variantName: string;
  attributes: Record<string, unknown>;
  unitOfMeasure: UnitOfMeasure;
  basePrice: number;
  currency: string;
  qtyAvailable: number;
  qtyReserved: number;
  variantStatus: VariantStatus;
  leadTimeDays: number | null;
  primaryPhotoUrl: string | null;
  productCreatedAt: string;
  variantCreatedAt: string;
}

/** Supplier discovery card with optional existing connection context. */
export interface SupplierDirectory extends SupplierProfile {
  tenantId: string;
  connection: Connection | null;
}

/** PO list row with joined names and rollups. */
export interface POSummary {
  id: string;
  poNumber: string;
  fabricatorId: string;
  fabricatorName: string;
  supplierId: string;
  supplierName: string;
  jobId: string | null;
  jobName: string | null;
  jobNumber: string | null;
  status: POStatus;
  totalAmount: number;
  currency: string;
  requestedDelivery: string | null;
  confirmedDelivery: string | null;
  sentAt: string | null;
  ackedAt: string | null;
  shippedAt: string | null;
  receivedAt: string | null;
  totalLines: number;
  confirmedLines: number;
  declinedLines: number;
  pendingLines: number;
  ackHours: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Standard API success envelope. */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    totalCount: number;
    page: number;
    perPage: number;
    hasNextPage: boolean;
  };
}

/** Typed API failure envelope. */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode?: number;
}

/** Fabricator slab catalog search filters. */
export interface SlabSearchParams {
  materialTypes?: MaterialType[];
  colorFamilies?: ColorFamily[];
  finishes?: SlabFinish[];
  thicknessMin?: number;
  thicknessMax?: number;
  priceMin?: number;
  priceMax?: number;
  minSqft?: number;
  supplierIds?: string[];
  searchQuery?: string;
  isRemnant?: boolean;
  sortBy?: SlabSortBy;
  sortDir?: SortDir;
  page?: number;
  perPage?: number;
}

/** Non-slab product discovery filters. */
export interface ProductSearchParams {
  productCategories?: ProductCategory[];
  supplierId?: string;
  searchQuery?: string;
  inStockOnly?: boolean;
  page?: number;
  perPage?: number;
}

/** Shared PO inbox/outbox filters. */
export interface POFilters {
  status?: POStatus;
  supplierId?: string;
  fabricatorId?: string;
  jobId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
}

/** List endpoints always return pagination meta. */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: NonNullable<ApiResponse<T[]>['meta']>;
}

/** Supplier create slab payload — server derives net areas and defaults status. */
export type CreateSlabDto = Partial<
  Omit<
    Slab,
    | 'id'
    | 'netSqft'
    | 'netSqm'
    | 'statusChanged'
    | 'reservedForPo'
    | 'createdAt'
    | 'updatedAt'
  >
> &
  Pick<
    Slab,
    | 'variantId'
    | 'supplierId'
    | 'internalRef'
    | 'materialType'
    | 'materialName'
    | 'thicknessCm'
    | 'finish'
    | 'grossLengthMm'
    | 'grossWidthMm'
  >;

/** Fabricator draft PO creation payload. */
export interface CreatePODto {
  supplierId: string;
  jobId?: string;
  deliveryAddressId?: string;
  requestedDelivery?: string;
  fabricatorNotes?: string;
  internalRef?: string;
  lineItems: Array<{
    variantId: string;
    slabId?: string;
    quantity: number;
    unitPrice: number;
    unitOfMeasure: UnitOfMeasure;
  }>;
}

/** Supplier acknowledgement of PO lines. */
export interface AcknowledgePODto {
  lineItems: Array<{
    id: string;
    status: 'confirmed' | 'declined' | 'substituted';
    declineReason?: string;
    substituteVariant?: string;
    substituteSlab?: string;
    counterPrice?: number;
    counterNote?: string;
  }>;
}

/** Fabricator or supplier counter-offer submission. */
export interface CounterPODto {
  counterOffer: CounterOffer;
}
