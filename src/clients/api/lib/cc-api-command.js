/**
 * @import { CcApiType } from '../types/cc-api.types.js'
 * @import { IdResolve } from '../types/resource-id-resolver.types.js'
 */
import { CompositeCommand, SimpleCommand } from '../../../lib/command/command.js';

/**
 * @extends {SimpleCommand<CcApiType, CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiSimpleCommand extends SimpleCommand {
  isAuthRequired() {
    return true;
  }

  /**
   * @returns {IdResolve|null}
   */
  getIdsToResolve() {
    return null;
  }
}

/**
 * @extends {CompositeCommand<CcApiType, CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiCompositeCommand extends CompositeCommand {
  /**
   * @returns {IdResolve|null}
   */
  getIdsToResolve() {
    return null;
  }
}
