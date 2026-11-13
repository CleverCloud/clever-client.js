import { CompositeCommand, SimpleCommand } from '../../../lib/command/command.ts';
import type { CcApiBridgeType } from '../types/cc-api-bridge.types.ts';

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

/**
 * @template CommandInput
 * @template CommandOutput
 */
export abstract class CcApiBridgeCompositeCommand<CommandInput, CommandOutput> extends CompositeCommand<
  CcApiBridgeType,
  CommandInput,
  CommandOutput
> {
  get api(): CcApiBridgeType {
    return 'cc-api-bridge';
  }
}
