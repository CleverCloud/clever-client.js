/**
 * Minimal surface we need from a `DOMParser`, so the browser and Node implementations are
 * interchangeable.
 */
export interface DomParserLike {
  parseFromString(_source: string, _type: string): Document;
}
