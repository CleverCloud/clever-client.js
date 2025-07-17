import type { RedisHttpCommandInput } from '../../types/redis-http.types.js';

export interface CmdCliSendCommandInput extends RedisHttpCommandInput {
  /**
   * Redis© Command line
   */
  commandLine: string;
}

export interface CmdCliSendCommandOutput {
  /**
   * Whether the command execution was successful or not
   */
  success: boolean;
  /**
   * Result of the command split into an array of string
   */
  result: Array<string>;
}
