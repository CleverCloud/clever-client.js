import { AbstractNetworkgroupStream } from './networkgroup.abstract.js';
import { addOauthHeader } from '../oauth.browser.js';

export class NetworkgroupStream extends AbstractNetworkgroupStream {

  atob (str) {
    return window.atob(str);
  }

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
