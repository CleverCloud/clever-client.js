/**
 * Identifies the setting to write, and the value to store in it.
 */
export interface SetUserSettingCommandInput {
  /**
   * Environment the setting is scoped to. Omit it for the default scope.
   * @sentAs `env`
   */
  environment?: string;
  /** Name of the setting. */
  name: string;
  /**
   * Value to store.
   * @sentAs a plain text request body
   */
  value: string;
}
