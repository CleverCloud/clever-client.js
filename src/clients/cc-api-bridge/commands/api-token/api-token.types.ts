export interface ApiToken {
  apiTokenId: string;
  userId: string;
  // renamed from creationDate
  // transformed: converted to an ISO date string
  createdAt: string;
  // renamed from expirationDate
  // transformed: converted to an ISO date string
  expiresAt: string;
  ip: string;
  name: string;
  description?: string;
  state: 'ACTIVE' | 'EXPIRED';
}
