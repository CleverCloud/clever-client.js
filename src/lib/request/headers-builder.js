const JSON_MIME_TYPE = 'application/json';
const TEXT_PLAIN_MIME_TYPE = 'text/plain';

/**
 * Helper to build headers
 */
export class HeadersBuilder {
  /** @type {Headers} */
  #headers;

  /**
   * @param {Headers|Record<string, string>|null} [headers]
   */
  constructor(headers) {
    if (headers == null) {
      this.#headers = new Headers();
    } else {
      this.#headers = new Headers(headers);
    }
  }

  /**
   * @returns {HeadersBuilder}
   */
  acceptJson() {
    return this.accept(JSON_MIME_TYPE);
  }

  /**
   * @returns {HeadersBuilder}
   */
  acceptTextPlain() {
    return this.accept(TEXT_PLAIN_MIME_TYPE);
  }

  /**
   * @returns {HeadersBuilder}
   */
  contentTypeJson() {
    return this.contentType(JSON_MIME_TYPE);
  }

  /**
   * @returns {HeadersBuilder}
   */
  contentTypeTextPlain() {
    return this.contentType(TEXT_PLAIN_MIME_TYPE);
  }

  /**
   * @param {string} mimeType
   * @returns {HeadersBuilder}
   */
  accept(mimeType) {
    return this.withHeader('accept', mimeType);
  }

  /**
   * @param {string} mimeType
   * @returns {HeadersBuilder}
   */
  contentType(mimeType) {
    return this.withHeader('content-type', mimeType);
  }

  /**
   * @param {string} value
   * @returns {HeadersBuilder}
   */
  authorization(value) {
    return this.withHeader('authorization', value);
  }

  /**
   * @param {string} header
   * @param {string} value
   * @returns {HeadersBuilder}
   */
  withHeader(header, value) {
    this.#headers.set(header, value);
    return this;
  }

  /**
   * @returns {Headers}
   */
  build() {
    return this.#headers;
  }
}
