import EventSource from 'eventsource';
import { AbstractNetworkgroupStream } from './networkgroup.abstract';
import { addOauthHeader } from '../oauth.node.js';

export class NetworkgroupStream extends AbstractNetworkgroupStream {

  btoa (str) {
    return Buffer.from(str).toString('base64');
  }

  addOauthHeader (tokens) {
    return addOauthHeader(tokens);
  }

  createEventSource (url) {
    return new EventSource(url);
  }

}
