export interface CreateApiTokenCommandInput {
  // renamed from email
  emailAddress: string;
  password: string;
  mfaCode?: string;
  name: string;
  description?: string;
  // renamed from expirationDate
  expiresAt: string | Date | number;
}

export interface CreateApiTokenCommandResponse {
  apiToken: string;
  apiTokenId: string;
  // renamed from creationDate
  // transformed: converted to an ISO date string
  createdAt: string;
  // renamed from expirationDate
  // transformed: converted to an ISO date string
  expiresAt: string;
  name: string;
  description?: string;
  state: 'ACTIVE' | 'EXPIRED';
}
