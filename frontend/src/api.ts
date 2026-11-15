import {
  AuthResponse,
  UserSummary,
  ItemResponse,
  SmartMatch,
  Claim,
  SafeReturnHandover,
  LockerRecord,
  Belonging,
  CampusBuilding,
  CampusZone,
  CampusRoute,
  RadarMarker,
  NotificationItem,
  LeaderboardEntry,
  UserAchievement,
  AnalyticsData
} from './types';

const BASE_URL = '/api';

export function getToken(): string | null {
  return localStorage.getItem('lostlink_token');
}

export function setToken(token: string) {
  localStorage.setItem('lostlink_token', token);
}

export function removeToken() {
  localStorage.removeItem('lostlink_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorBody.message || `Request failed: ${response.status}`);
  }

  // Handle empty or 204 responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return {} as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (data: any) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  getCurrentUser: () =>
    request<UserSummary>('/auth/me'),

  // Items
  createItem: (data: any) =>
    request<ItemResponse>('/items', { method: 'POST', body: JSON.stringify(data) }),

  getItems: (params: { type?: string; category?: string; location?: string; query?: string; page?: number; size?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.type) query.set('type', params.type);
    if (params.category) query.set('category', params.category);
    if (params.location) query.set('location', params.location);
    if (params.query) query.set('query', params.query);
    if (params.page !== undefined) query.set('page', params.page.toString());
    if (params.size !== undefined) query.set('size', params.size.toString());
    return request<{ content: ItemResponse[]; totalPages: number; totalElements: number }>(`/items?${query.toString()}`);
  },

  getItemById: (id: number) =>
    request<ItemResponse>(`/items/${id}`),

  getMyReports: () =>
    request<ItemResponse[]>('/items/my-reports'),

  deleteItem: (id: number) =>
    request<{ message: string }>(`/items/${id}`, { method: 'DELETE' }),

  // Matches
  getMatchesForItem: (itemId: number) =>
    request<SmartMatch[]>(`/matches/item/${itemId}`),

  getHighConfidenceMatches: () =>
    request<SmartMatch[]>('/matches/high-confidence'),

  recomputeMatches: (itemId: number) =>
    request<any[]>(`/matches/recompute/${itemId}`, { method: 'POST' }),

  // Claims
  submitClaim: (data: any) =>
    request<Claim>('/claims', { method: 'POST', body: JSON.stringify(data) }),

  getMyClaims: () =>
    request<Claim[]>('/claims/my-claims'),

  getAllClaims: () =>
    request<Claim[]>('/claims/all'),

  reviewClaim: (id: number, approve: boolean, notes: string) =>
    request<Claim>(`/claims/${id}/review`, { method: 'POST', body: JSON.stringify({ approve, notes }) }),

  // SafeReturn Handover
  verifyHandover: (claimId: number, verificationCodeOrToken: string) =>
    request<SafeReturnHandover>('/safe-return/verify', {
      method: 'POST',
      body: JSON.stringify({ claimId, verificationCodeOrToken }),
    }),

  getHandoverByClaim: (claimId: number) =>
    request<SafeReturnHandover>(`/safe-return/claim/${claimId}`),

  // Lockers
  getLockers: () =>
    request<LockerRecord[]>('/lockers'),

  assignLocker: (lockerId: number, itemId: number, notes?: string) =>
    request<LockerRecord>(`/lockers/${lockerId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ itemId, notes }),
    }),

  releaseLocker: (lockerId: number) =>
    request<LockerRecord>(`/lockers/${lockerId}/release`, { method: 'POST' }),

  // Belongings Vault
  getBelongings: () =>
    request<Belonging[]>('/belongings'),

  addBelonging: (data: any) =>
    request<Belonging>('/belongings', { method: 'POST', body: JSON.stringify(data) }),

  deleteBelonging: (id: number) =>
    request<{ message: string }>(`/belongings/${id}`, { method: 'DELETE' }),

  reportBelongingAsLost: (id: number, locationName?: string, buildingId?: number) =>
    request<ItemResponse>(`/belongings/${id}/report-lost`, {
      method: 'POST',
      body: JSON.stringify({ locationName, buildingId }),
    }),

  // Campus & CampusVerse
  getCampusBuildings: () =>
    request<CampusBuilding[]>('/campus/buildings'),

  getCampusZones: () =>
    request<CampusZone[]>('/campus/zones'),

  getLostRadarData: () =>
    request<{
      campusCenter: { name: string; latitude: number; longitude: number; worldRadiusMeters: number };
      markers: RadarMarker[];
      totalMarkers: number;
    }>('/campus/radar'),

  getCampusRoute: (fromId: number, toId: number) =>
    request<CampusRoute>(`/campus/route?from=${fromId}&to=${toId}`),

  // Notifications
  getNotifications: () =>
    request<NotificationItem[]>('/notifications'),

  getUnreadCount: () =>
    request<{ unreadCount: number }>('/notifications/unread-count'),

  markNotificationRead: (id: number) =>
    request<{ message: string }>(`/notifications/${id}/read`, { method: 'POST' }),

  markAllNotificationsRead: () =>
    request<{ message: string }>('/notifications/read-all', { method: 'POST' }),

  // Community & Rewards
  getLeaderboard: () =>
    request<LeaderboardEntry[]>('/rewards/leaderboard'),

  getMyAchievements: () =>
    request<UserAchievement[]>('/rewards/my-achievements'),

  // Analytics
  getPublicAnalytics: () =>
    request<AnalyticsData>('/analytics/public'),

  getAdminAnalytics: () =>
    request<AnalyticsData>('/analytics/admin'),

  // LinkBot Assistant
  chatWithLinkBot: (message: string, context?: string) =>
    request<{
      reply: string;
      intent: string;
      suggestions: string[];
      actionLink?: string;
      actionText?: string;
    }>('/linkbot/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),

  // Admin
  getAdminUsers: () =>
    request<UserSummary[]>('/admin/users'),

  updateUserStatus: (userId: number, status: string) =>
    request<UserSummary>(`/admin/users/${userId}/status`, { method: 'POST', body: JSON.stringify({ status }) }),

  getAuditLogs: (page = 0, size = 25) =>
    request<{ content: any[]; totalPages: number; totalElements: number }>(`/admin/audit-logs?page=${page}&size=${size}`),
};
