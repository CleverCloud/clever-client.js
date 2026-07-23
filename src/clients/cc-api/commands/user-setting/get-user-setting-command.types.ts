export interface GetUserSettingCommandInput {
  environment?: string;
  name: string;
}

export type GetUserSettingCommandOutput = string;
