import type { RedisHttpCommandInput } from '../../types/redis-http.types.js';

/**
 * The command line to run, exactly as it would be typed in the Redis© CLI
 */
export interface CmdCliSendCommandInput extends RedisHttpCommandInput {
  /**
   * Redis© Command line
   */
  commandLine: string;
}

/**
 * What the command line answered, formatted the way the Redis© CLI would print it
 */
export interface CmdCliSendCommandOutput {
  /**
   * Whether the command execution was successful or not
   */
  isSuccess: boolean;
  /**
   * Result of the command split into an array of string
   */
  result: Array<string>;
}
