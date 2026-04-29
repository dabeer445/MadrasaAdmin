import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminApi } from '../services/AdminApiContext';
import { queryKeys } from './useQueryKeys';
import type { CreateUserPayload } from '../types';

export function useUsers() {
  const api = useAdminApi();
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => api.getUsers(),
  });
}

export function useCreateUser() {
  const api = useAdminApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => api.createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
