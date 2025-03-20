export interface CreateApiTokenCommandInput {
  email: string;
  password: string;
  mfaCode?: string;
  name: string;
  description?: string;
  expirationDate: Date;
}

export interface CreateApiTokenCommandResponse {
  apiToken: string;
  apiTokenId: string;
  creationDate: Date;
  expirationDate: Date;
  name: string;
  description?: string;
  state: 'ACTIVE' | 'EXPIRED';
}
