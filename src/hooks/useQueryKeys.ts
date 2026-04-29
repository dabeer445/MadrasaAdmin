export const queryKeys = {
  stats: {
    platform: ['stats', 'platform'] as const,
  },
  schools: {
    all: ['schools'] as const,
    list: () => ['schools', 'list'] as const,
    detail: (id: number) => ['schools', 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: () => ['users', 'list'] as const,
  },
};
