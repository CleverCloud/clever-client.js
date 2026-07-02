import { SimpleCommand } from '../../../lib/command/command.js';
import type { CcApiBridgeType } from '../types/cc-api-bridge.types.js';

/**
 * @template CommandInput
 * @template CommandOutput
 */
export abstract class CcApiBridgeCommand<CommandInput, CommandOutput> extends SimpleCommand<
  CcApiBridgeType,
  CommandInput,
  CommandOutput
> {
  get api(): CcApiBridgeType {
    return 'cc-api-bridge';
  }
}
