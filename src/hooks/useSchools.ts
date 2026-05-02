import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminApi } from '../services/AdminApiContext';
import { queryKeys } from './useQueryKeys';
import type { CreateSchoolPayload, UpdateSchoolPayload } from '../types';

export function useSchools() {
  const api = useAdminApi();
  return useQuery({
    queryKey: queryKeys.schools.list(),
    queryFn: () => api.getSchools(),
  });
}

export function useSchool(id: number) {
  const api = useAdminApi();
  return useQuery({
    queryKey: queryKeys.schools.detail(id),
    queryFn: () => api.getSchool(id),
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const api = useAdminApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSchoolPayload) => api.createSchool(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.schools.all });
      qc.invalidateQueries({ queryKey: queryKeys.stats.platform });
    },
  });
}

export function useUploadLogo() {
  const api = useAdminApi();
  return useMutation({
    mutationFn: (file: File) => api.uploadLogo(file),
  });
}

export function useDeleteSchool() {
  const api = useAdminApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteSchool(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.schools.all });
      qc.invalidateQueries({ queryKey: queryKeys.stats.platform });
    },
  });
}

export function useUpdateSchool(schoolId: number) {
  const api = useAdminApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSchoolPayload) => api.updateSchool(schoolId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.schools.all });
    },
  });
}
