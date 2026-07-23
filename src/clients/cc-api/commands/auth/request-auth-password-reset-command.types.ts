export interface RequestAuthPasswordResetCommandInput {
  login: string;
  shouldDropTokens?: boolean;
  partnerId?: string;
}
