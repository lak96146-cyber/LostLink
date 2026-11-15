export type RoleType = 'ROLE_STUDENT' | 'ROLE_ADMIN' | 'ROLE_GUARDIAN';
export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'REPORTED' | 'UNDER_VERIFICATION' | 'MATCHED' | 'CLAIMED' | 'HANDOVER_PENDING' | 'RECOVERED' | 'ARCHIVED';
export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ClaimStatus = 'PENDING_VERIFICATION' | 'UNDER_ADMIN_REVIEW' | 'APPROVED' | 'REJECTED' | 'HANDOVER_SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type HandoverStatus = 'SCHEDULED' | 'READY_FOR_PICKUP' | 'VERIFIED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
export type LockerStatus = 'AVAILABLE' | 'OCCUPIED' | 'AWAITING_COLLECTION' | 'RELEASED' | 'MAINTENANCE';
export type ConfidenceLevel = 'STRONG_MATCH' | 'POSSIBLE_MATCH' | 'WEAK_MATCH';

export interface UserSummary {
  id: number;
  email: string;
  fullName: string;
  studentId?: string;
  department?: string;
  role: RoleType;
  trustScore: number;
  goodSamaritanPoints: number;
  status: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: UserSummary;
}

export interface ItemResponse {
  id: number;
  type: ItemType;
  title: string;
  category: string;
  description?: string;
  brand?: string;
  color?: string;
  dateLostOrFound?: string;
  locationName: string;
  buildingId?: number;
  campusZone?: string;
  latitude?: number;
  longitude?: number;
  urgency: UrgencyLevel;
  status: ItemStatus;
  isCritical: boolean;
  imageUrl?: string;
  reporter: UserSummary;
  hasPrivateDna: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SmartMatch {
  id: number;
  lostItemId: number;
  foundItemId: number;
  lostItem: ItemResponse;
  foundItem: ItemResponse;
  overallScore: number;
  nameScore: number;
  categoryScore: number;
  descriptionScore: number;
  locationScore: number;
  dateScore: number;
  colorScore: number;
  brandScore: number;
  distanceMeters?: number;
  daysDifference?: number;
  confidenceClassification: ConfidenceLevel;
  matchReasons: string[];
  matchingAttributes: string[];
  mismatchingAttributes: string[];
  createdAt: string;
}

export interface SafeReturnHandover {
  id: number;
  claimId: number;
  handoverCode: string;
  qrToken: string;
  qrCodeBase64: string;
  status: HandoverStatus;
  lockerId?: number;
  handoverLocation: string;
  scheduledTime?: string;
  completedTime?: string;
  digitalReceiptId?: string;
  notes?: string;
  createdAt: string;
}

export interface Claim {
  id: number;
  lostItemId?: number;
  foundItemId: number;
  foundItem: ItemResponse;
  claimant: UserSummary;
  status: ClaimStatus;
  riskLevel: RiskLevel;
  verificationScore: number;
  claimDescription?: string;
  serialNumberAttempt?: string;
  distinctiveMarksAttempt?: string;
  claimantProofImage?: string;
  adminNotes?: string;
  handover?: SafeReturnHandover;
  createdAt: string;
  updatedAt?: string;
}

export interface LockerRecord {
  id: number;
  lockerReference: string;
  physicalLocation: string;
  itemId?: number;
  status: LockerStatus;
  intakeDate?: string;
  releaseDate?: string;
  assignedAdminId?: number;
  notes?: string;
}

export interface Belonging {
  id: number;
  name: string;
  category: string;
  brand?: string;
  color?: string;
  serialNumber?: string;
  distinctiveMarks?: string;
  estimatedValue?: number;
  imageUrl?: string;
  createdAt: string;
}

export interface CampusBuilding {
  id: number;
  name: string;
  code: string;
  category: string;
  latitude: number;
  longitude: number;
  heightMeters: number;
  widthMeters: number;
  depthMeters: number;
  floors: number;
  description: string;
}

export interface CampusZone {
  id: number;
  name: string;
  code: string;
  description: string;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  colorHex: string;
}

export interface CampusRoute {
  fromBuildingId: number;
  fromBuildingName: string;
  toBuildingId: number;
  toBuildingName: string;
  totalDistanceMeters: number;
  estimatedDurationMinutes: number;
  directions: string[];
  pathCoordinates: [number, number][];
  routeFound: boolean;
}

export interface RadarMarker {
  id: number;
  title: string;
  type: ItemType;
  category: string;
  status: ItemStatus;
  locationName: string;
  latitude: number;
  longitude: number;
  localX: number;
  localZ: number;
  urgency: UrgencyLevel;
  isCritical: boolean;
  imageUrl?: string;
  dateLostOrFound?: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  targetLink?: string;
  isRead: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  fullName: string;
  department?: string;
  points: number;
  trustScore: number;
  avatarUrl?: string;
}

export interface UserAchievement {
  id: number;
  badgeCode: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalReports: number;
  lostReports: number;
  foundReports: number;
  recoveredItems: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  recoveryRatePercentage: number;
  averageRecoveryHours: number;
  activeSmartMatches: number;
  totalBelongingsSecured: number;
  categoryDistribution: Record<string, number>;
  buildingDistribution: Record<string, number>;
  hotspots: {
    locationName: string;
    latitude: number;
    longitude: number;
    reportCount: number;
    intensity: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  recentActivities: {
    type: string;
    title: string;
    timestamp: string;
    user: string;
  }[];
}
