import { SimpleCommand } from '../../../lib/command/command.ts';
import { createBrand, hasBrand, setBrand } from '../../../lib/utils.ts';
import type { RedisHttpType } from '../types/redis-http.types.ts';

// A cross-version contract, see createBrand()
const REDIS_HTTP_COMMAND_BRAND = createBrand('RedisHttpCommand');

/**
 * Base class for Redis HTTP commands.
 * Provides common functionality for all Redis commands sent through the HTTP proxy.
 *
 * @template CommandInput - Type of the command's input parameters
 * @template CommandOutput - Type of the command's output
 * @abstract
 */
export abstract class RedisHttpCommand<CommandInput, CommandOutput> extends SimpleCommand<
  RedisHttpType,
  CommandInput,
  CommandOutput
> {
  static {
    setBrand(this.prototype, REDIS_HTTP_COMMAND_BRAND);
  }

  /**
   * The API type identifier for Redis HTTP commands.
   * Used by the client to route commands to the correct API endpoint.
   */
  get api(): RedisHttpType {
    return 'redis-http';
  }

  /**
   * Indicates whether this command requires a Redis backend URL.
   * By default, all Redis HTTP commands require a backend URL.
   * Override this method to return false for commands that don't need a backend.
   *
   * @returns True if the command requires a backend URL
   */
  requiresBackendUrl(): boolean {
    return true;
  }
}

/**
 * Whether the given command is a {@link RedisHttpCommand}, whichever copy of this package created it.
 *
 * @param command - The command to test
 */
export function isRedisHttpCommand(command: unknown): command is RedisHttpCommand<unknown, unknown> {
  return hasBrand(command, REDIS_HTTP_COMMAND_BRAND);
}
