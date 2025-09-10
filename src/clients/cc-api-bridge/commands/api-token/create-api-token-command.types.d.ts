export interface CreateApiTokenCommandInput {
  email: string;
  password: string;
  mfaCode?: string;
  name: string;
  description?: string;
  expirationDate: string | Date | number;
}

export interface CreateApiTokenCommandResponse {
  apiToken: string;
  apiTokenId: string;
  creationDate: string;
  expirationDate: string;
  name: string;
  description?: string;
  state: 'ACTIVE' | 'EXPIRED';
}
