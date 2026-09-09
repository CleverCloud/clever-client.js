import { loadDomParser } from '#dom-parser';
import type { DomParserLike } from './dom-parser.types.js';

let cachedDomParser: DomParserLike | null = null;

/**
 * Parses an XML string into a document.
 *
 * @param source - The XML to parse, trimmed before parsing since leading whitespace makes a document invalid
 */
export async function parseXmlString(source: string): Promise<Document> {
  const domParser = await getDomParser();

  return domParser.parseFromString(source.trim(), 'application/xml');
}

/**
 * Parses an HTML string into a document.
 *
 * The source is wrapped in `<html><body>` because implementations disagree on loose markup: browsers
 * move it into `<body>`, `linkedom` leaves the document empty. Wrapping it makes `document.body`
 * hold the parsed markup everywhere.
 *
 * @param source - The HTML to parse, which may be a fragment
 */
export async function parseHtmlString(source: string): Promise<Document> {
  const domParser = await getDomParser();

  return domParser.parseFromString(`<html><body>${source.trim()}</body></html>`, 'text/html');
}

/**
 * Loads the DOM parser for the current environment, once per process.
 *
 * `#dom-parser` is a conditional subpath import: bundlers targeting a browser resolve it to the
 * implementation using the global `DOMParser`, so `linkedom` never enters a browser bundle.
 */
async function getDomParser(): Promise<DomParserLike> {
  if (cachedDomParser == null) {
    cachedDomParser = await loadDomParser();
  }

  return cachedDomParser;
}
