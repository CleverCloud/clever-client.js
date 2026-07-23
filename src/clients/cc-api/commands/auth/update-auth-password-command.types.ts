export interface UpdateAuthPasswordCommandInput {
  oldPassword: string;
  newPassword: string;
  // renamed from dropTokens
  shouldRevokeTokens?: boolean;
}
