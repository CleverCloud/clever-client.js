const JSON_MIME_TYPE = 'application/json';

export class HeadersBuilder {
  /** @type {Headers} */
  #headers;

  /**
   * @param {Headers|Record<string, string>|null} [headers]
   */
  constructor (headers) {
    if (headers == null) {
      this.#headers = new Headers();
    }
    else {
      this.#headers = new Headers(headers);
    }
  }

  /**
   * @returns {HeadersBuilder}
   */
  acceptJson () {
    return this.accept(JSON_MIME_TYPE);
  }

  /**
   * @returns {HeadersBuilder}
   */
  contentTypeJson () {
    return this.contentType(JSON_MIME_TYPE);
  }

  /**
   * @param {string} mimeType
   * @returns {HeadersBuilder}
   */
  accept (mimeType) {
    return this.withHeader('accept', mimeType);
  }

  /**
   * @param {string} mimeType
   * @returns {HeadersBuilder}
   */
  contentType (mimeType) {
    return this.withHeader('content-type', mimeType);
  }

  /**
   * @param {string} value
   * @returns {HeadersBuilder}
   */
  authorization (value) {
    return this.withHeader('authorization', value);
  }

  /**
   * @param {string} header
   * @param {string} value
   * @returns {HeadersBuilder}
   */
  withHeader (header, value) {
    this.#headers.set(header, value);
    return this;
  }

  /**
   * @returns {Headers}
   */
  build () {
    return this.#headers;
  }
}

// export class Headers {
//   /** @type {Map<string, string>} */
//   #headers = new Map();
//
//   /**
//    * @param {Record<string, string>} [headers]
//    */
//   constructor (headers) {
//     if (headers != null) {
//       this.setHeaders(headers);
//     }
//   }
//
//   /**
//    * @param {string} header
//    * @param {string} value
//    * @returns {Headers}
//    */
//   set (header, value) {
//     this.#headers.set(header.toLowerCase(), value);
//     return this;
//   }
//
//   /**
//    * @param {Record<string, string>} headers
//    * @returns {Headers}
//    */
//   setHeaders (headers) {
//     Object.entries(headers).forEach(([key, value]) => {
//       this.set(key, value);
//     });
//     return this;
//   }
//
//   /**
//    * @param {string} header
//    * @returns {string}
//    */
//   get (header) {
//     return this.#headers.get(header.toLowerCase());
//   }
//
//   /**
//    * @param {string} header
//    * @returns {string|null}
//    */
//   remove (header) {
//     const value = this.get(header);
//
//     this.#headers.delete(header.toLowerCase());
//
//     return value;
//   }
//
//   /**
//    * @param {string} acceptMimeType
//    * @returns {Headers}
//    */
//   accept (acceptMimeType) {
//     this.set('accept', acceptMimeType);
//     return this;
//   }
//
//   /**
//    * @param {string} contentMimeType
//    * @returns {Headers}
//    */
//   contentType (contentMimeType) {
//     this.set('content-type', contentMimeType);
//     return this;
//   }
// }
