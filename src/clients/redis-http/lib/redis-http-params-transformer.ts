import type { CompositeCommand } from '../../../lib/command/command.ts';
import type { CcClientParamsTransformer } from '../../../types/client.types.ts';
import type { CcRequestConfigPartial } from '../../../types/request.types.ts';
import type { RedisHttpCommandInput, RedisHttpType } from '../types/redis-http.types.ts';
import { isRedisHttpCommand, type RedisHttpCommand } from './redis-http-command.ts';

/**
 * Injects the default Redis© backend URL of the client into the commands that require one and do not
 * specify their own.
 */
export class RedisHttpParamsTransformer implements CcClientParamsTransformer<RedisHttpType> {
  /**
   * Default Redis© database URL, injected into the commands that require a backend
   */
  readonly #backendUrl: string | undefined;

  /**
   * @param backendUrl - Default Redis© database URL of the client
   */
  constructor(backendUrl: string | undefined) {
    this.#backendUrl = backendUrl;
  }

  /**
   * Injects the default backend URL into a command requiring one, unless its params specify it.
   *
   * @param command - Command to transform
   * @param _requestConfig - The request configuration the command is sent with
   * @returns Transformed command parameters
   */
  transformParams(
    command: RedisHttpCommand<unknown, unknown> | CompositeCommand<RedisHttpType, unknown, unknown>,
    _requestConfig: CcRequestConfigPartial | undefined,
  ): Promise<unknown> {
    if (
      this.#backendUrl != null &&
      isRedisHttpCommand(command) &&
      command.requiresBackendUrl() &&
      (command.params as RedisHttpCommandInput)?.backendUrl == null
    ) {
      return Promise.resolve({
        ...(command.params as Record<string, unknown>),
        backendUrl: this.#backendUrl,
      });
    }
    return Promise.resolve(command.params);
  }
}
