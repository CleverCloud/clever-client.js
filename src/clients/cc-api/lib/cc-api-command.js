/**
 * @import { CcApiType } from '../types/cc-api.types.js'
 * @import { IdResolve } from '../types/resource-id-resolver.types.js'
 * @import { CcStream } from '../../../lib/stream/cc-stream.js'
 */
import { CompositeCommand, SimpleCommand } from '../../../lib/command/command.js';
import { StreamCommand } from '../../../lib/stream/stream-command.js';

/**
 * @extends {SimpleCommand<CcApiType, CommandInput, CommandOutput>}
 * @template CommandInput
 * @template CommandOutput
 * @abstract
 */
export class CcApiSimpleCommand extends SimpleCommand {
  /**
   * @returns {IdResolve|null}
   */
  getIdsToResolve() {
    return null;
  }

  /** @type {SimpleCommand<CcApiType, CommandInput, CommandOutput>['api']} */
  get api() {
    return 'cc-api';
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

  /** @type {SimpleCommand<CcApiType, CommandInput, CommandOutput>['api']} */
  get api() {
    return 'cc-api';
  }
}

/**
 * @extends {StreamCommand<CcApiType, CommandInput, Stream>}
 * @template CommandInput
 * @template {CcStream} Stream
 * @abstract
 */
export class CcApiStreamCommand extends StreamCommand {
  /**
   * @returns {IdResolve|null}
   */
  getIdsToResolve() {
    return null;
  }

  /** @type {SimpleCommand<CcApiType, CommandInput, Stream>['api']} */
  get api() {
    return 'cc-api';
  }
}
