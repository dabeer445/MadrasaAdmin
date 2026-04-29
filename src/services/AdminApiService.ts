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
      throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
    }

    const data: ApiSuccess<T> = await res.json();
    return data.result;
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
