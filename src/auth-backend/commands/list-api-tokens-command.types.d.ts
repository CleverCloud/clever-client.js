export type ListApiTokensCommandResponse = Array<ApiToken>;

export interface ApiToken {
  apiTokenId: string;
  userId: string;
  creationDate: Date;
  expirationDate: Date;
  ip: string;
  name: string;
  description?: string;
  state: 'ACTIVE' | 'EXPIRED';
}
