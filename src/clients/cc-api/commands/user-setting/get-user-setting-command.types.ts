/**
 * Identifies the setting to read.
 */
export interface GetUserSettingCommandInput {
  /**
   * Environment the setting is scoped to. Omit it for the default scope.
   * @sentAs `env`
   */
  environment?: string;
  /** Name of the setting. */
  name: string;
}

/**
 * The stored value, pulled out of the `{ name, value }` wrapper the API returns.
 */
export type GetUserSettingCommandOutput = string;
