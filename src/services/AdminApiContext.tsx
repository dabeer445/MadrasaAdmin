import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { AdminApiService } from './AdminApiService';

const AdminApiContext = createContext<AdminApiService | null>(null);

export function AdminApiProvider({ children, service }: { children: ReactNode; service: AdminApiService }) {
  return <AdminApiContext.Provider value={service}>{children}</AdminApiContext.Provider>;
}

export function useAdminApi(): AdminApiService {
  const ctx = useContext(AdminApiContext);
  if (!ctx) throw new Error('useAdminApi must be used inside AdminApiProvider');
  return ctx;
}
