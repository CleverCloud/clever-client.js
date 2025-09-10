import type { RedisHttpCommandInput } from '../../types/redis-http.types.js';

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

export interface CmdSendCommandOutput {
  result: ValueOrArray<string | number | null>;
}

type ValueOrArray<T> = T | Array<ValueOrArray<T>>;
