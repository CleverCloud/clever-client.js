import { CompositeCommand, SimpleCommand } from '../../../lib/command/command.ts';
import type { CcStream } from '../../../lib/stream/cc-stream.ts';
import { StreamCommand } from '../../../lib/stream/stream-command.ts';
import type { CcApiType } from '../types/cc-api.types.ts';
import type { IdResolve } from '../types/resource-id-resolver.types.ts';

/**
 * @template CommandInput
 * @template CommandOutput
 */
export abstract class CcApiSimpleCommand<CommandInput, CommandOutput> extends SimpleCommand<
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
export abstract class CcApiCompositeCommand<CommandInput, CommandOutput> extends CompositeCommand<
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
export abstract class CcApiStreamCommand<CommandInput, Stream extends CcStream> extends StreamCommand<
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
