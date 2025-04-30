/**
 * @import { CcApiBridgeType } from '../types/cc-api-bridge.types.js'
 */
import { SimpleCommand } from '../../../lib/command/command.js';

/**
 * @extends {SimpleCommand<CcApiBridgeType, CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiBridgeCommand extends SimpleCommand {
  /** @type {SimpleCommand<CcApiBridgeType, CommandInput, CommandOutput>['api']} */
  get api() {
    return 'cc-api-bridge';
  }
}
