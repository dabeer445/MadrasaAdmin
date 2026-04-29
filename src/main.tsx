import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './services/AuthContext';
import { AdminApiProvider } from './services/AdminApiContext';
import { AdminApiService } from './services/AdminApiService';
import App from './App';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

const adminApiService = new AdminApiService(API_URL);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider apiUrl={API_URL}>
        <QueryClientProvider client={queryClient}>
          <AdminApiProvider service={adminApiService}>
            <App />
          </AdminApiProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
