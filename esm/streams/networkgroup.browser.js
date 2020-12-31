import { AbstractNetworkgroupStream } from './networkgroup.abstract';
import { addOauthHeader } from '../oauth.browser.js';

export class NetworkgroupStream extends AbstractNetworkgroupStream {

  btoa (str) {
    return window.btoa(str);
  }

  addOauthHeader (tokens) {
    return addOauthHeader(tokens);
  }

  createEventSource (url) {
    return new window.EventSource(url);
  }

}
