import type { DomParserLike } from './dom-parser.types.js';

/**
 * Loads the DOM parser a browser exposes as a global.
 */
export function loadDomParser(): Promise<DomParserLike> {
  return Promise.resolve(new globalThis.DOMParser());
}
