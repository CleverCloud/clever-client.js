import { get } from '../../lib/request/request-params-builder.js';
import { AbstractApiCommand } from './abstract-api-command.js';

/**
 * @extends {AbstractApiCommand<import('./get-self-command.types.js').GetSelfCommandResponse>}
 */
export class GetSelfCommand extends AbstractApiCommand {
  toRequestParams() {
    return get('/v2/self');
  }
}
