import { SimpleCommand } from '../../../lib/command/command.js';
import type { RedisHttpType } from '../types/redis-http.types.js';

/**
 * Base class for Redis HTTP commands.
 * Provides common functionality for all Redis commands sent through the HTTP proxy.
 *
 * @template CommandInput - Type of the command's input parameters
 * @template CommandOutput - Type of the command's output
 * @abstract
 */
export class RedisHttpCommand<CommandInput, CommandOutput> extends SimpleCommand<
  RedisHttpType,
  CommandInput,
  CommandOutput
> {
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
