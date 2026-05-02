// ─── Tenant (School) ─────────────────────────────────────────────────────────

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'suspended';

export interface School {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
  address: string;
  phone: string;
  adminPhones: string[];
  whatsappSessionId: string | null;
  whatsappToken: string | null;
  monthlyDueDate: number;       // 1–28
  annualFeeMonth: string;       // "01"–"12"
  annualFee: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: number | null;  // Unix timestamp (seconds), null = no hard cutoff
}

// ─── Users ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'super_admin';

export interface User {
  id: string;           // usr_<timestamp>_<random>
  username: string;
  role: UserRole;
  schoolId?: number;    // only present when role === 'admin'
}

// ─── Platform Stats ───────────────────────────────────────────────────────────

export interface PlatformStats {
  totalSchools: number;
  totalStudents: number;
  totalPayments: number;
  totalPaymentsAmount: number;
  totalExpenses: number;
  totalExpensesAmount: number;
}

// ─── API Primitives ───────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  result: T;
}

export interface ApiError {
  error: string;
}

// ─── Mutation Payloads ────────────────────────────────────────────────────────

export interface CreateSchoolPayload {
  slug?: string;
  name: string;
  logoUrl?: string | null;
  address?: string;
  phone?: string;
  adminPhones?: string[];
  whatsappSessionId?: string | null;
  whatsappToken?: string | null;
  monthlyDueDate: number;
  annualFeeMonth: string;
  annualFee: number;
  subscriptionStatus: SubscriptionStatus;
}

export interface UpdateSchoolPayload {
  name?: string;
  logoUrl?: string | null;
  address?: string;
  phone?: string;
  adminPhones?: string[];
  whatsappSessionId?: string | null;
  whatsappToken?: string | null;
  monthlyDueDate?: number;
  annualFeeMonth?: string;
  annualFee?: number;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiresAt?: number | null;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  role: UserRole;
  schoolId?: number;  // required when role === 'admin'
}
