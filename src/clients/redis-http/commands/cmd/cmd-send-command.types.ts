import type { RedisHttpCommandInput } from '../../types/redis-http.types.js';

/**
 * The command to run and the arguments to pass to it
 */
export interface CmdSendCommandInput extends RedisHttpCommandInput {
  /**
   * Redis© command
   */
  command: string;
  /**
   * Arguments
   */
  args?: Array<string>;
}

/**
 * What the command answered
 */
export interface CmdSendCommandOutput {
  /**
   * The reply, kept in the shape Redis© returned it: a single value, or arbitrarily nested arrays
   */
  result: ValueOrArray<string | number | null>;
}

/**
 * A value, or an arbitrarily nested array of such values
 *
 * @template T - Type of the leaf values
 */
type ValueOrArray<T> = T | Array<ValueOrArray<T>>;
