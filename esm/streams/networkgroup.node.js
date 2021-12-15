import EventSource from 'eventsource';
import { AbstractNetworkgroupStream } from './networkgroup.abstract';
import { addOauthHeader } from '../oauth.node.js';

export class NetworkgroupStream extends AbstractNetworkgroupStream {

  atob (str) {
    return Buffer.from(str, 'base64').toString();
  }

  btoa (str) {
    return Buffer.from(str).toString('base64');
  }

  addOauthHeader (tokens) {
    return addOauthHeader(tokens);
  }

  createEventSource (url) {
    return new EventSource(url);
  }

  _onError (error) {
    // console.debug(`SSE Error: ${JSON.stringify(error, null, 2)}`);
    console.error(error);
    console.trace();
    super._onError(error);
  }

}
