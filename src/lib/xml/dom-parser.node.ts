import type { DomParserLike } from './dom-parser.types.js';

/**
 * Loads the DOM parser from `linkedom`, because Node has no global `DOMParser`.
 *
 * `linkedom` is an optional peer dependency. Only the article commands parse markup, so callers that
 * never send them do not have to install it. The import is dynamic to keep the failure at call time,
 * where the error can name the missing package.
 */
export async function loadDomParser(): Promise<DomParserLike> {
  try {
    const { DOMParser } = await import('linkedom');

    return new DOMParser() as unknown as DomParserLike;
  } catch (cause) {
    throw new Error('Parsing markup in Node requires the optional peer dependency `linkedom`.', { cause });
  }
}
