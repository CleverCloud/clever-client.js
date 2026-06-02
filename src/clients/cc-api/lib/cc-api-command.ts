import { CompositeCommand, SimpleCommand } from '../../../lib/command/command.js';
import type { CcStream } from '../../../lib/stream/cc-stream.js';
import { StreamCommand } from '../../../lib/stream/stream-command.js';
import type { CcApiType } from '../types/cc-api.types.js';
import type { IdResolve } from '../types/resource-id-resolver.types.js';

/**
 * @template CommandInput
 * @template CommandOutput
 */
export class CcApiSimpleCommand<CommandInput, CommandOutput> extends SimpleCommand<
  CcApiType,
  CommandInput,
  CommandOutput
> {
  getIdsToResolve(): IdResolve | null {
    return null;
  }

  get api(): CcApiType {
    return 'cc-api';
  }
}

/**
 * @template CommandInput
 * @template CommandOutput
 */
export class CcApiCompositeCommand<CommandInput, CommandOutput> extends CompositeCommand<
  CcApiType,
  CommandInput,
  CommandOutput
> {
  getIdsToResolve(): IdResolve | null {
    return null;
  }

  get api(): CcApiType {
    return 'cc-api';
  }
}

/**
 * @template CommandInput
 * @template Stream
 */
export class CcApiStreamCommand<CommandInput, Stream extends CcStream> extends StreamCommand<
  CcApiType,
  CommandInput,
  Stream
> {
  getIdsToResolve(): IdResolve | null {
    return null;
  }

  get api(): CcApiType {
    return 'cc-api';
  }
}
