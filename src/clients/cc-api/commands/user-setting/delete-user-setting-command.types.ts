/**
 * Identifies the setting to remove.
 */
export interface DeleteUserSettingCommandInput {
  /**
   * Environment the setting is scoped to. Omit it for the default scope.
   * @sentAs `env`
   */
  environment?: string;
  /** Name of the setting. */
  name: string;
}
