import type {
  School, User, PlatformStats, ApiSuccess,
  CreateSchoolPayload, UpdateSchoolPayload, CreateUserPayload,
} from '../types';

export class AdminApiService {
  private apiUrl: string;
  constructor(apiUrl: string) { this.apiUrl = apiUrl; }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('sa_token');
    const res = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (Array.isArray(body)) {
        throw new Error(body[0]?.message ?? `HTTP ${res.status}`);
      }
      throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
    }

    const data: ApiSuccess<T> = await res.json();
    return data.result;
  }

  // ─── Uploads ─────────────────────────────────────────────────────────────────

  async uploadLogo(file: File): Promise<string> {
    const token = localStorage.getItem('sa_token');
    const body = new FormData();
    body.append('file', file);
    const res = await fetch(`${this.apiUrl}/admin/upload-logo`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });

    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      if (Array.isArray(b)) throw new Error(b[0]?.message ?? `HTTP ${res.status}`);
      throw new Error((b as { error?: string }).error ?? `HTTP ${res.status}`);
    }

    const data = await res.json() as { success: true; logoUrl: string };
    return data.logoUrl;
  }

  // ─── Schools ────────────────────────────────────────────────────────────────

  getSchools(): Promise<School[]> {
    return this.request('/admin/schools');
  }

  getSchool(id: number): Promise<School> {
    return this.request(`/admin/schools/${id}`);
  }

  createSchool(payload: CreateSchoolPayload): Promise<School> {
    return this.request('/admin/schools', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  updateSchool(id: number, payload: UpdateSchoolPayload): Promise<School> {
    return this.request(`/admin/schools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  deleteSchool(id: number): Promise<void> {
    return this.request(`/admin/schools/${id}`, { method: 'DELETE' });
  }

  // ─── Users ───────────────────────────────────────────────────────────────────

  getUsers(): Promise<User[]> {
    return this.request('/admin/users');
  }

  createUser(payload: CreateUserPayload): Promise<User> {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ─── Platform Stats ───────────────────────────────────────────────────────────

  getPlatformStats(): Promise<PlatformStats> {
    return this.request('/admin/stats');
  }
}
