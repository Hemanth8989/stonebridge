import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, searchCatalogSlabs, getSlabDetail } from '@sb/api-client';
import type { SlabSearchParams } from '@sb/types';

export function useCatalogSlabs(params: SlabSearchParams) {
  return useQuery({
    queryKey: queryKeys.slabs.search(params),
    queryFn: () => searchCatalogSlabs(params),
    placeholderData: keepPreviousData,
  });
}

export function useSlabDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.slabs.detail(id!),
    queryFn: () => getSlabDetail(id!),
    enabled: !!id,
  });
}
