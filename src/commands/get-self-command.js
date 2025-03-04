import { AbstractCommand } from './abstract-command.js';
import { HeadersBuilder } from '../request/headers-builder.js';

/**
 * @extends {AbstractCommand<import('./get-self-command.types.js').GetSelfCommandResponse>}
 */
export class GetSelfCommand extends AbstractCommand {
  toRequestParams () {
    return {
      method: 'GET',
      url: '/v2/self',
      headers: new HeadersBuilder({ accept: 'application/json' }).build(),
    };
  }
}
