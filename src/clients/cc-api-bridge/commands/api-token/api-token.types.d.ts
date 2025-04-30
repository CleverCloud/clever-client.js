export interface ApiToken {
  apiTokenId: string;
  userId: string;
  creationDate: string;
  expirationDate: string;
  ip: string;
  name: string;
  description?: string;
  state: 'ACTIVE' | 'EXPIRED';
}
