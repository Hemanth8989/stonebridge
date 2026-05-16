// @sb/utils — shared formatting, domain helpers, and small utilities

import type {
  ConnStatus,
  JobStatus,
  POStatus,
  SlabStatus,
  SortDir,
  VariantStatus,
} from '@sb/types';

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;
const MS_PER_MONTH_APPROX = MS_PER_DAY * 30;
const MS_PER_YEAR_APPROX = MS_PER_DAY * 365;

/**
 * Formats a numeric amount as currency using `Intl.NumberFormat`.
 * @example formatCurrency(1234.5) → '$1,234.50'
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Compact currency suitable for dense dashboards (e.g. millions).
 * @example formatCurrencyCompact(1234567) → '$1.2M'
 */
export function formatCurrencyCompact(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Formats an ISO timestamp for display; returns an em dash placeholder when missing.
 */
export function formatDate(
  iso: string | null | undefined,
  opts?: Intl.DateTimeFormatOptions,
): string {
  if (iso == null || iso === '') {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  const options: Intl.DateTimeFormatOptions = opts ?? {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(d);
}

/** MM/DD/YY short date for tables and chips. */
export function formatDateShort(iso: string | null | undefined): string {
  if (iso == null || iso === '') {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

/** Human-readable local date plus time, e.g. 'May 14, 2026 at 9:42 AM'. */
export function formatDateTime(iso: string | null | undefined): string {
  if (iso == null || iso === '') {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
  return `${datePart} at ${timePart}`;
}

/**
 * Compact relative time from now using threshold buckets.
 * Returns one of: just now | Xm ago | Xh ago | Xd ago | Xw ago | Xmo ago | Xy ago
 */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return 'just now';
  }
  const now = Date.now();
  const diffMs = now - then;
  if (diffMs < 0) {
    return 'just now';
  }
  if (diffMs < MS_PER_MINUTE) {
    return 'just now';
  }
  if (diffMs < MS_PER_HOUR) {
    const m = Math.floor(diffMs / MS_PER_MINUTE);
    return `${m}m ago`;
  }
  if (diffMs < MS_PER_DAY) {
    const h = Math.floor(diffMs / MS_PER_HOUR);
    return `${h}h ago`;
  }
  if (diffMs < MS_PER_WEEK) {
    const d = Math.floor(diffMs / MS_PER_DAY);
    return `${d}d ago`;
  }
  if (diffMs < MS_PER_MONTH_APPROX) {
    const w = Math.floor(diffMs / MS_PER_WEEK);
    return `${w}w ago`;
  }
  if (diffMs < MS_PER_YEAR_APPROX) {
    const mo = Math.floor(diffMs / MS_PER_MONTH_APPROX);
    return `${mo}mo ago`;
  }
  const y = Math.floor(diffMs / MS_PER_YEAR_APPROX);
  return `${y}y ago`;
}

/** True when the instant is strictly before now. */
export function isOverdue(iso: string | null | undefined): boolean {
  if (iso == null || iso === '') {
    return false;
  }
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) {
    return false;
  }
  return t < Date.now();
}

/**
 * Whole calendar days until the given instant (floored vs local midnight pairs).
 * Returns null when input is missing or invalid.
 */
export function daysUntil(iso: string | null | undefined): number | null {
  if (iso == null || iso === '') {
    return null;
  }
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) {
    return null;
  }
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTarget = new Date(target);
  startOfTarget.setHours(0, 0, 0, 0);
  const diff = startOfTarget.getTime() - startOfToday.getTime();
  return Math.floor(diff / MS_PER_DAY);
}

/** Formats imperial slab area for labels and tiles. */
export function formatArea(sqft: number, decimals = 1): string {
  return `${sqft.toFixed(decimals)} sq ft`;
}

/** Formats metric slab area with a superscript-style suffix via Unicode. */
export function formatAreaMetric(sqm: number, decimals = 2): string {
  return `${sqm.toFixed(decimals)} m²`;
}

/** Converts millimeters to inch dimensions with a multiplication sign separator. */
export function formatDimensions(lengthMm: number, widthMm: number): string {
  const l = mmToInches(lengthMm, 1);
  const w = mmToInches(widthMm, 1);
  return `${l}" × ${w}"`;
}

/** Metric dimensions in millimeters with a multiplication sign separator. */
export function formatDimensionsMetric(lengthMm: number, widthMm: number): string {
  return `${lengthMm} × ${widthMm} mm`;
}

/** Human slab thickness label using centimeters. */
export function formatThickness(cm: number): string {
  const rounded = Number.isInteger(cm) ? String(cm) : cm.toFixed(1).replace(/\.0$/, '');
  return `${rounded} cm`;
}

/** Millimeters to inches with configurable rounding. */
export function mmToInches(mm: number, decimals = 1): number {
  const inches = mm / 25.4;
  const factor = 10 ** decimals;
  return Math.round(inches * factor) / factor;
}

/** Terminal PO states that cannot progress without reopen semantics. */
export function isPOTerminal(status: POStatus): boolean {
  return status === 'closed' || status === 'cancelled';
}

/** Draft-only editing gate on the fabricator side. */
export function isPOEditable(status: POStatus): boolean {
  return status === 'draft';
}

/**
 * Fabricator must respond when supplier partially acknowledges or counters terms.
 */
export function isPOAwaitingAction(status: POStatus): boolean {
  return status === 'countered' || status === 'partially_acked';
}

/** Only available slabs may be added to new PO lines. */
export function isSlabOrderable(status: SlabStatus): boolean {
  return status === 'available';
}

/** Maps raw PO status enums to title-case UX strings. */
export function getPoStatusLabel(status: POStatus): string {
  const labels: Record<POStatus, string> = {
    draft: 'Draft',
    sent: 'Sent',
    acknowledged: 'Acknowledged',
    partially_acked: 'Partial ack',
    countered: 'Countered',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    received: 'Received',
    closed: 'Closed',
    disputed: 'Disputed',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

/** Semantic color bucket for PO status badges and timelines. */
export function getPoStatusColor(
  status: POStatus,
): 'gray' | 'blue' | 'green' | 'amber' | 'red' {
  const map: Record<POStatus, 'gray' | 'blue' | 'green' | 'amber' | 'red'> = {
    draft: 'gray',
    sent: 'blue',
    acknowledged: 'green',
    partially_acked: 'amber',
    countered: 'amber',
    confirmed: 'green',
    shipped: 'blue',
    received: 'green',
    closed: 'gray',
    disputed: 'red',
    cancelled: 'gray',
  };
  return map[status];
}

/** Human-readable slab inventory label. */
export function getSlabStatusLabel(status: SlabStatus): string {
  const labels: Record<SlabStatus, string> = {
    available: 'Available',
    reserved: 'Reserved',
    allocated: 'Allocated',
    shipped: 'Shipped',
    hold: 'On hold',
    sold: 'Sold',
  };
  return labels[status];
}

/** Badge-friendly slab status color bucket. */
export function getSlabStatusColor(
  status: SlabStatus,
): 'green' | 'amber' | 'blue' | 'red' | 'gray' {
  const map: Record<SlabStatus, 'green' | 'amber' | 'blue' | 'red' | 'gray'> = {
    available: 'green',
    reserved: 'amber',
    allocated: 'blue',
    shipped: 'blue',
    hold: 'red',
    sold: 'gray',
  };
  return map[status];
}

/** Variant availability label for storefront chips. */
export function getVariantStatusLabel(status: VariantStatus): string {
  const labels: Record<VariantStatus, string> = {
    available: 'Available',
    low_stock: 'Low stock',
    out_of_stock: 'Out of stock',
    discontinued: 'Discontinued',
  };
  return labels[status];
}

/** Badge mapping for variant availability. */
export function getVariantStatusColor(
  status: VariantStatus,
): 'green' | 'amber' | 'red' | 'gray' {
  const map: Record<VariantStatus, 'green' | 'amber' | 'red' | 'gray'> = {
    available: 'green',
    low_stock: 'amber',
    out_of_stock: 'red',
    discontinued: 'gray',
  };
  return map[status];
}

/** Supplier–fabricator connection label for directory UI. */
export function getConnStatusLabel(status: ConnStatus): string {
  const labels: Record<ConnStatus, string> = {
    pending: 'Pending',
    active: 'Active',
    suspended: 'Suspended',
    declined: 'Declined',
    terminated: 'Terminated',
  };
  return labels[status];
}

/** Fabricator job lifecycle label. */
export function getJobStatusLabel(status: JobStatus): string {
  const labels: Record<JobStatus, string> = {
    quoted: 'Quoted',
    approved: 'Approved',
    templated: 'Templated',
    fabricating: 'Fabricating',
    ready: 'Ready',
    installed: 'Installed',
    closed: 'Closed',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

/** Price per square foot rounded to cents; safe when area is zero. */
export function pricePerSqft(price: number, sqft: number): number {
  if (sqft === 0) {
    return 0;
  }
  return roundTo(price / sqft, 2);
}

/** Monetary line math with two-decimal rounding. */
export function lineTotal(price: number, quantity: number): number {
  return roundTo(price * quantity, 2);
}

/**
 * Truncates a string to a maximum grapheme-friendly length using JS string indices.
 * Appends an ellipsis suffix when truncation occurs.
 */
export function truncate(str: string, maxLength: number, ellipsis = '…'): string {
  if (maxLength <= 0) {
    return ellipsis;
  }
  if (str.length <= maxLength) {
    return str;
  }
  const sliceLen = Math.max(0, maxLength - ellipsis.length);
  return `${str.slice(0, sliceLen)}${ellipsis}`;
}

/** Uppercases the first code unit (ASCII-safe for typical labels). */
export function capitalize(str: string): string {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Title cases tokens split on whitespace and underscores.
 * @example titleCase('hello_world') → 'Hello World'
 */
export function titleCase(str: string): string {
  return str
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((w) => capitalize(w.toLowerCase()))
    .join(' ');
}

/**
 * URL/blog style slug from arbitrary marketing copy.
 * @example slugify('Apex Stone Co.') → 'apex-stone-co'
 */
export function slugify(str: string): string {
  return str
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Builds initials from a display name, capped to `max` characters (default 2).
 */
export function initials(name: string, max = 2): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '';
  }
  const letters = parts.map((p) => p.charAt(0).toUpperCase()).join('');
  return letters.slice(0, Math.max(1, max));
}

/** Groups collection elements by a string key. */
export function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of arr) {
    const key = keyFn(item);
    const bucket = out[key];
    if (bucket) {
      bucket.push(item);
    } else {
      out[key] = [item];
    }
  }
  return out;
}

/** Stable ascending/descending sort by a primitive sort key. */
export function sortBy<T>(
  arr: T[],
  keyFn: (item: T) => string | number,
  dir: SortDir = 'ASC',
): T[] {
  const mult = dir === 'DESC' ? -1 : 1;
  return [...arr].sort((a, b) => {
    const ka = keyFn(a);
    const kb = keyFn(b);
    if (ka < kb) {
      return -1 * mult;
    }
    if (ka > kb) {
      return 1 * mult;
    }
    return 0;
  });
}

/** First-wins dedupe by key function while preserving input order. */
export function uniqueBy<T>(arr: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    out.push(item);
  }
  return out;
}

/** Numeric aggregation helper for tables and KPIs. */
export function sumBy<T>(arr: T[], valueFn: (item: T) => number): number {
  let total = 0;
  for (const item of arr) {
    total += valueFn(item);
  }
  return total;
}

/** Histogram helper keyed by string buckets. */
export function countBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of arr) {
    const key = keyFn(item);
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

/** Debounces trailing edge calls for noisy UI handlers. */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}

/** Standard leading-edge throttle: at most one invocation per window. */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

/** Numeric clamp to inclusive bounds. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Half-up rounding to arbitrary decimal places. */
export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Percentage of value relative to total (0–100); zero-safe. */
export function percentOf(value: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return roundTo((value / total) * 100, 2);
}

function appendSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value: unknown,
): void {
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

/**
 * Builds `?a=b` query strings for fetch wrappers; skips nullish entries.
 * Arrays repeat the same key per element.
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    appendSearchParam(searchParams, key, value);
  }
  const qs = searchParams.toString();
  return qs.length > 0 ? `?${qs}` : '';
}

/** Narrows unknown values to strings. */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/** Narrows unknown values to finite numbers. */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** Filters null and undefined from unions without loose equality pitfalls. */
export function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
