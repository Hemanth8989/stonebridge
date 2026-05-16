// @sb/api-client — typed REST accessors + TanStack Query hooks for StoneBridge portals

import type {
  AcknowledgePODto,
  ApiError,
  ApiResponse,
  CatalogProduct,
  CatalogSlab,
  Connection,
  CounterPODto,
  CreatePODto,
  CreateSlabDto,
  Job,
  Notification,
  NotificationPrefs,
  POFilters,
  PaginatedResponse,
  POSummary,
  ProductSearchParams,
  PurchaseOrder,
  Slab,
  SlabSearchParams,
  SlabStatus,
  SupplierDirectory,
} from '@sb/types';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

// --- Local query-string helper (keeps package deps aligned with package.json) ---

function appendSearchParam(searchParams: URLSearchParams, key: string, value: unknown): void {
  if (value === undefined || value === null) {
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      if (item === undefined || item === null) {
        continue;
      }
      searchParams.append(key, String(item));
    }
    return;
  }
  if (typeof value === 'object') {
    searchParams.append(key, JSON.stringify(value));
    return;
  }
  searchParams.append(key, String(value));
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    appendSearchParam(searchParams, key, value);
  }
  const qs = searchParams.toString();
  return qs.length > 0 ? `?${qs}` : '';
}

// --- Section 1: ApiClient ---

class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getToken: () => string | null,
  ) {}

  private mergeHeaders(token: string | null, init?: RequestInit): Headers {
    const headers = new Headers(init?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    const isFormData = init?.body instanceof FormData;
    if (isFormData) {
      headers.delete('Content-Type');
    } else if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  private async parseJson<T>(res: Response): Promise<T> {
    if (res.status === 204) {
      return undefined as T;
    }
    const text = await res.text();
    if (text.length === 0) {
      return undefined as T;
    }
    return JSON.parse(text) as T;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: this.mergeHeaders(token, init),
    });

    if (!res.ok) {
      const err: ApiError = await this.parseJson<ApiError>(res).catch(() => ({
        code: 'UNKNOWN',
        message: `HTTP ${String(res.status)}`,
        statusCode: res.status,
      }));
      throw err;
    }

    return this.parseJson<T>(res);
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  del<T = void>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

let _client: ApiClient | undefined;

export const initApiClient = (baseUrl: string, getToken: () => string | null): void => {
  _client = new ApiClient(baseUrl, getToken);
};

export const getApiClient = (): ApiClient => {
  if (!_client) {
    throw new Error('ApiClient not initialised — call initApiClient() in main.tsx first');
  }
  return _client;
};

// --- Section 2: query keys ---

export const queryKeys = {
  slabs: {
    all: () => ['slabs'] as const,
    search: (params: SlabSearchParams) => ['slabs', 'search', params] as const,
    detail: (id: string) => ['slabs', id] as const,
  },
  products: {
    all: () => ['products'] as const,
    list: (params?: ProductSearchParams) => ['products', 'list', params] as const,
    detail: (id: string) => ['products', id] as const,
  },
  supplierSlabs: {
    all: () => ['supplier-slabs'] as const,
    list: (filters?: Record<string, unknown>) => ['supplier-slabs', 'list', filters] as const,
    detail: (id: string) => ['supplier-slabs', id] as const,
  },
  supplierProducts: {
    all: () => ['supplier-products'] as const,
    list: () => ['supplier-products', 'list'] as const,
  },
  pos: {
    all: () => ['pos'] as const,
    list: (filters?: POFilters) => ['pos', 'list', filters] as const,
    detail: (id: string) => ['pos', id] as const,
  },
  connections: {
    all: () => ['connections'] as const,
    suppliers: () => ['connections', 'suppliers'] as const,
    requests: () => ['connections', 'requests'] as const,
  },
  jobs: {
    all: () => ['jobs'] as const,
    list: () => ['jobs', 'list'] as const,
    detail: (id: string) => ['jobs', id] as const,
    pos: (jobId: string) => ['jobs', jobId, 'pos'] as const,
  },
  notifications: {
    all: () => ['notifications'] as const,
    unread: () => ['notifications', 'unread'] as const,
  },
  analytics: {
    supplierSpend: () => ['analytics', 'supplier-spend'] as const,
    fabricatorSpend: () => ['analytics', 'fabricator-spend'] as const,
    inventoryAging: () => ['analytics', 'inventory-aging'] as const,
    supplierStats: () => ['analytics', 'supplier-stats'] as const,
  },
} as const;

// --- Section 3: API functions ---

export async function searchCatalogSlabs(
  params: SlabSearchParams,
): Promise<PaginatedResponse<CatalogSlab>> {
  const client = getApiClient();
  const qs = buildQueryString(params as unknown as Record<string, unknown>);
  return client.get<PaginatedResponse<CatalogSlab>>(`/api/v1/catalog/slabs${qs}`);
}

export async function getCatalogProducts(
  params?: ProductSearchParams,
): Promise<PaginatedResponse<CatalogProduct>> {
  const client = getApiClient();
  const qs =
    params === undefined ? '' : buildQueryString(params as unknown as Record<string, unknown>);
  return client.get<PaginatedResponse<CatalogProduct>>(`/api/v1/catalog/products${qs}`);
}

export async function getSlabDetail(id: string): Promise<ApiResponse<CatalogSlab>> {
  const client = getApiClient();
  return client.get<ApiResponse<CatalogSlab>>(`/api/v1/catalog/slabs/${id}`);
}

export async function getProductDetail(id: string): Promise<ApiResponse<CatalogProduct>> {
  const client = getApiClient();
  return client.get<ApiResponse<CatalogProduct>>(`/api/v1/catalog/products/${id}`);
}

export async function getSupplierSlabs(
  filters?: Record<string, unknown>,
): Promise<PaginatedResponse<Slab>> {
  const client = getApiClient();
  const qs =
    filters === undefined ? '' : buildQueryString(filters as Record<string, unknown>);
  return client.get<PaginatedResponse<Slab>>(`/api/v1/supplier/slabs${qs}`);
}

export async function getSupplierSlabDetail(id: string): Promise<ApiResponse<Slab>> {
  const client = getApiClient();
  return client.get<ApiResponse<Slab>>(`/api/v1/supplier/slabs/${id}`);
}

export async function createSlab(data: CreateSlabDto): Promise<ApiResponse<Slab>> {
  const client = getApiClient();
  return client.post<ApiResponse<Slab>>('/api/v1/supplier/slabs', data);
}

export async function updateSlab(
  id: string,
  data: Partial<CreateSlabDto>,
): Promise<ApiResponse<Slab>> {
  const client = getApiClient();
  return client.patch<ApiResponse<Slab>>(`/api/v1/supplier/slabs/${id}`, data);
}

export async function updateSlabStatus(
  id: string,
  status: SlabStatus,
): Promise<ApiResponse<Slab>> {
  const client = getApiClient();
  return client.patch<ApiResponse<Slab>>(`/api/v1/supplier/slabs/${id}/status`, { status });
}

export async function deleteSlab(id: string): Promise<void> {
  const client = getApiClient();
  await client.del(`/api/v1/supplier/slabs/${id}`);
}

export async function bulkImportSlabs(
  formData: FormData,
): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
  const client = getApiClient();
  return client.post<ApiResponse<{ imported: number; errors: string[] }>>(
    '/api/v1/supplier/slabs/import',
    formData,
  );
}

export async function getPurchaseOrders(
  filters?: POFilters,
): Promise<PaginatedResponse<POSummary>> {
  const client = getApiClient();
  const qs =
    filters === undefined ? '' : buildQueryString(filters as unknown as Record<string, unknown>);
  return client.get<PaginatedResponse<POSummary>>(`/api/v1/purchase-orders${qs}`);
}

export async function getPurchaseOrder(id: string): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.get<ApiResponse<PurchaseOrder>>(`/api/v1/purchase-orders/${id}`);
}

export async function createPurchaseOrder(
  data: CreatePODto,
): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.post<ApiResponse<PurchaseOrder>>('/api/v1/purchase-orders', data);
}

export async function acknowledgePO(
  id: string,
  data: AcknowledgePODto,
): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.post<ApiResponse<PurchaseOrder>>(`/api/v1/purchase-orders/${id}/ack`, data);
}

export async function counterPO(
  id: string,
  data: CounterPODto,
): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.post<ApiResponse<PurchaseOrder>>(`/api/v1/purchase-orders/${id}/counter`, data);
}

export async function acceptCounter(id: string): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.post<ApiResponse<PurchaseOrder>>(
    `/api/v1/purchase-orders/${id}/accept-counter`,
    {},
  );
}

export async function cancelPO(id: string): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.post<ApiResponse<PurchaseOrder>>(`/api/v1/purchase-orders/${id}/cancel`, {});
}

export async function markPOShipped(
  id: string,
  data: { trackingNumber?: string; carrier?: string },
): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.post<ApiResponse<PurchaseOrder>>(`/api/v1/purchase-orders/${id}/ship`, data);
}

export async function confirmPOReceived(id: string): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.post<ApiResponse<PurchaseOrder>>(
    `/api/v1/purchase-orders/${id}/receive`,
    {},
  );
}

export async function raisePODispute(
  id: string,
  data: { note: string; photos?: string[] },
): Promise<ApiResponse<PurchaseOrder>> {
  const client = getApiClient();
  return client.post<ApiResponse<PurchaseOrder>>(`/api/v1/purchase-orders/${id}/dispute`, data);
}

export async function getConnections(): Promise<ApiResponse<Connection[]>> {
  const client = getApiClient();
  return client.get<ApiResponse<Connection[]>>('/api/v1/connections');
}

export async function getConnectionRequests(): Promise<ApiResponse<Connection[]>> {
  const client = getApiClient();
  return client.get<ApiResponse<Connection[]>>('/api/v1/connections/requests');
}

export async function requestConnection(
  supplierId: string,
  message?: string,
): Promise<ApiResponse<Connection>> {
  const client = getApiClient();
  return client.post<ApiResponse<Connection>>('/api/v1/connections/request', {
    supplierId,
    message,
  });
}

export async function approveConnection(id: string): Promise<ApiResponse<Connection>> {
  const client = getApiClient();
  return client.post<ApiResponse<Connection>>(`/api/v1/connections/${id}/approve`, {});
}

export async function declineConnection(
  id: string,
  reason?: string,
): Promise<ApiResponse<Connection>> {
  const client = getApiClient();
  return client.post<ApiResponse<Connection>>(`/api/v1/connections/${id}/decline`, { reason });
}

export async function suspendConnection(id: string): Promise<ApiResponse<Connection>> {
  const client = getApiClient();
  return client.post<ApiResponse<Connection>>(`/api/v1/connections/${id}/suspend`, {});
}

export async function getSupplierDirectory(): Promise<ApiResponse<SupplierDirectory[]>> {
  const client = getApiClient();
  return client.get<ApiResponse<SupplierDirectory[]>>('/api/v1/suppliers/directory');
}

export async function getJobs(): Promise<PaginatedResponse<Job>> {
  const client = getApiClient();
  return client.get<PaginatedResponse<Job>>('/api/v1/jobs');
}

export async function getJob(id: string): Promise<ApiResponse<Job>> {
  const client = getApiClient();
  return client.get<ApiResponse<Job>>(`/api/v1/jobs/${id}`);
}

export async function createJob(data: Partial<Job>): Promise<ApiResponse<Job>> {
  const client = getApiClient();
  return client.post<ApiResponse<Job>>('/api/v1/jobs', data);
}

export async function updateJob(id: string, data: Partial<Job>): Promise<ApiResponse<Job>> {
  const client = getApiClient();
  return client.patch<ApiResponse<Job>>(`/api/v1/jobs/${id}`, data);
}

export async function getJobPOs(jobId: string): Promise<PaginatedResponse<POSummary>> {
  const client = getApiClient();
  return client.get<PaginatedResponse<POSummary>>(`/api/v1/jobs/${jobId}/purchase-orders`);
}

export async function getNotifications(): Promise<PaginatedResponse<Notification>> {
  const client = getApiClient();
  return client.get<PaginatedResponse<Notification>>('/api/v1/notifications');
}

export async function markNotificationRead(id: string): Promise<void> {
  const client = getApiClient();
  await client.post<void>(`/api/v1/notifications/${id}/read`, {});
}

export async function markAllNotificationsRead(): Promise<void> {
  const client = getApiClient();
  await client.post<void>('/api/v1/notifications/read-all', {});
}

export async function getNotificationPrefs(): Promise<ApiResponse<NotificationPrefs>> {
  const client = getApiClient();
  return client.get<ApiResponse<NotificationPrefs>>('/api/v1/notifications/preferences');
}

export async function updateNotificationPrefs(
  prefs: Partial<NotificationPrefs>,
): Promise<ApiResponse<NotificationPrefs>> {
  const client = getApiClient();
  return client.patch<ApiResponse<NotificationPrefs>>('/api/v1/notifications/preferences', prefs);
}

export type SupplierAnalyticsPayload = {
  revenueByMonth: Array<{ month: string; revenue: number }>;
  topBuyers: Array<{
    fabricatorId: string;
    fabricatorName: string;
    totalSpend: number;
    poCount: number;
  }>;
  avgResponseHrs: number;
  fulfillmentRate: number;
  inventoryAging: Array<{
    slabId: string;
    materialName: string;
    daysInStock: number;
    listPrice: number;
  }>;
};

export async function getSupplierAnalytics(): Promise<ApiResponse<SupplierAnalyticsPayload>> {
  const client = getApiClient();
  return client.get<ApiResponse<SupplierAnalyticsPayload>>('/api/v1/analytics/supplier');
}

export type FabricatorAnalyticsPayload = {
  spendBySupplier: Array<{
    supplierId: string;
    supplierName: string;
    totalSpend: number;
    poCount: number;
  }>;
  avgLeadTimeBySupplier: Array<{
    supplierId: string;
    supplierName: string;
    avgDays: number;
    publishedDays: number;
  }>;
  materialCosts: Array<{
    materialType: string;
    avgPricePerSqft: number;
    totalSqft: number;
  }>;
};

export async function getFabricatorAnalytics(): Promise<ApiResponse<FabricatorAnalyticsPayload>> {
  const client = getApiClient();
  return client.get<ApiResponse<FabricatorAnalyticsPayload>>('/api/v1/analytics/fabricator');
}

// --- Section 4: hooks ---

export function useCatalogSlabs(
  params: SlabSearchParams,
): UseQueryResult<PaginatedResponse<CatalogSlab>, ApiError> {
  return useQuery({
    queryKey: queryKeys.slabs.search(params),
    queryFn: () => searchCatalogSlabs(params),
    enabled: true,
  });
}

export function useSlabDetail(
  id: string | null,
): UseQueryResult<ApiResponse<CatalogSlab>, ApiError> {
  return useQuery({
    queryKey: id ? queryKeys.slabs.detail(id) : ['slabs', 'detail', 'nil'],
    queryFn: () => getSlabDetail(id as string),
    enabled: Boolean(id),
  });
}

export function useCatalogProducts(
  params?: ProductSearchParams,
): UseQueryResult<PaginatedResponse<CatalogProduct>, ApiError> {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getCatalogProducts(params),
  });
}

export function useSupplierSlabs(
  filters?: Record<string, unknown>,
): UseQueryResult<PaginatedResponse<Slab>, ApiError> {
  return useQuery({
    queryKey: queryKeys.supplierSlabs.list(filters),
    queryFn: () => getSupplierSlabs(filters),
  });
}

export function useCreateSlab(): UseMutationResult<ApiResponse<Slab>, ApiError, CreateSlabDto> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSlabDto) => createSlab(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.all() });
    },
  });
}

export function useUpdateSlabStatus(): UseMutationResult<
  ApiResponse<Slab>,
  ApiError,
  { id: string; status: SlabStatus }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SlabStatus }) => updateSlabStatus(id, status),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.all() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.supplierSlabs.detail(variables.id) });
    },
  });
}

export function usePurchaseOrders(
  filters?: POFilters,
): UseQueryResult<PaginatedResponse<POSummary>, ApiError> {
  return useQuery({
    queryKey: queryKeys.pos.list(filters),
    queryFn: () => getPurchaseOrders(filters),
  });
}

export function usePurchaseOrder(
  id: string | null,
): UseQueryResult<ApiResponse<PurchaseOrder>, ApiError> {
  return useQuery({
    queryKey: id ? queryKeys.pos.detail(id) : ['pos', 'detail', 'nil'],
    queryFn: () => getPurchaseOrder(id as string),
    enabled: Boolean(id),
  });
}

export function useCreatePO(): UseMutationResult<
  ApiResponse<PurchaseOrder>,
  ApiError,
  CreatePODto
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePODto) => createPurchaseOrder(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.slabs.all() });
    },
  });
}

export function useAcknowledgePO(): UseMutationResult<
  ApiResponse<PurchaseOrder>,
  ApiError,
  { id: string; data: AcknowledgePODto }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AcknowledgePODto }) => acknowledgePO(id, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(variables.id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
    },
  });
}

export function useCounterPO(): UseMutationResult<
  ApiResponse<PurchaseOrder>,
  ApiError,
  { id: string; data: CounterPODto }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CounterPODto }) => counterPO(id, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(variables.id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
    },
  });
}

export function useAcceptCounter(): UseMutationResult<
  ApiResponse<PurchaseOrder>,
  ApiError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptCounter(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
    },
  });
}

export function useCancelPO(): UseMutationResult<ApiResponse<PurchaseOrder>, ApiError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelPO(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
    },
  });
}

export function useMarkShipped(): UseMutationResult<
  ApiResponse<PurchaseOrder>,
  ApiError,
  { id: string; data: { trackingNumber?: string; carrier?: string } }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { trackingNumber?: string; carrier?: string } }) =>
      markPOShipped(id, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(variables.id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
    },
  });
}

export function useConfirmReceived(): UseMutationResult<
  ApiResponse<PurchaseOrder>,
  ApiError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmPOReceived(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.detail(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.pos.all() });
    },
  });
}

export function useConnections(): UseQueryResult<ApiResponse<Connection[]>, ApiError> {
  return useQuery({
    queryKey: queryKeys.connections.all(),
    queryFn: () => getConnections(),
  });
}

export function useConnectionRequests(): UseQueryResult<ApiResponse<Connection[]>, ApiError> {
  return useQuery({
    queryKey: queryKeys.connections.requests(),
    queryFn: () => getConnectionRequests(),
  });
}

export function useRequestConnection(): UseMutationResult<
  ApiResponse<Connection>,
  ApiError,
  { supplierId: string; message?: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ supplierId, message }: { supplierId: string; message?: string }) =>
      requestConnection(supplierId, message),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.connections.all() });
    },
  });
}

export function useApproveConnection(): UseMutationResult<
  ApiResponse<Connection>,
  ApiError,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveConnection(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.connections.all() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.connections.requests() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.connections.suppliers() });
    },
  });
}

export function useDeclineConnection(): UseMutationResult<
  ApiResponse<Connection>,
  ApiError,
  { id: string; reason?: string }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => declineConnection(id, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.connections.all() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.connections.requests() });
    },
  });
}

export function useSupplierDirectory(): UseQueryResult<
  ApiResponse<SupplierDirectory[]>,
  ApiError
> {
  return useQuery({
    queryKey: [...queryKeys.connections.all(), 'supplier-directory'] as const,
    queryFn: () => getSupplierDirectory(),
  });
}

export function useJobs(): UseQueryResult<PaginatedResponse<Job>, ApiError> {
  return useQuery({
    queryKey: queryKeys.jobs.list(),
    queryFn: () => getJobs(),
  });
}

export function useJob(id: string | null): UseQueryResult<ApiResponse<Job>, ApiError> {
  return useQuery({
    queryKey: id ? queryKeys.jobs.detail(id) : ['jobs', 'detail', 'nil'],
    queryFn: () => getJob(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateJob(): UseMutationResult<ApiResponse<Job>, ApiError, Partial<Job>> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Job>) => createJob(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
    },
  });
}

export function useUpdateJob(): UseMutationResult<
  ApiResponse<Job>,
  ApiError,
  { id: string; data: Partial<Job> }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) => updateJob(id, data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(variables.id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
    },
  });
}

export function useNotifications(): UseQueryResult<PaginatedResponse<Notification>, ApiError> {
  return useQuery({
    queryKey: queryKeys.notifications.all(),
    queryFn: () => getNotifications(),
  });
}

export function useMarkNotificationRead(): UseMutationResult<void, ApiError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread() });
    },
  });
}

export function useMarkAllNotificationsRead(): UseMutationResult<void, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread() });
    },
  });
}
