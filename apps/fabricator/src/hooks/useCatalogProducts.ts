import { useQuery } from '@tanstack/react-query';
import { queryKeys, getCatalogProducts, getProductDetail } from '@sb/api-client';
import type { ProductSearchParams } from '@sb/types';

export function useCatalogProducts(params?: ProductSearchParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getCatalogProducts(params),
  });
}

export function useProductDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.products.detail(id!),
    queryFn: () => getProductDetail(id!),
    enabled: !!id,
  });
}
