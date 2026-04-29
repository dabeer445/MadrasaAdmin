import { useQuery } from '@tanstack/react-query';
import { useAdminApi } from '../services/AdminApiContext';
import { queryKeys } from './useQueryKeys';

export function usePlatformStats() {
  const api = useAdminApi();
  return useQuery({
    queryKey: queryKeys.stats.platform,
    queryFn: () => api.getPlatformStats(),
    staleTime: 1000 * 60 * 5,
  });
}
