const JSON_MIME_TYPE = 'application/json';
const TEXT_PLAIN_MIME_TYPE = 'text/plain';
const TEXT_HTML_MIME_TYPE = 'text/html';
const EVENT_STREAM_CONTENT_TYPE = 'text/event-stream';

/**
 * Helper to build headers
 */
export class HeadersBuilder {
  private _headers: Headers;

  constructor(headers?: Headers | Record<string, string> | null) {
    if (headers == null) {
      this._headers = new Headers();
    } else {
      this._headers = new Headers(headers);
    }
  }

  acceptJson(): HeadersBuilder {
    return this.accept(JSON_MIME_TYPE);
  }

  acceptTextPlain(): HeadersBuilder {
    return this.accept(TEXT_PLAIN_MIME_TYPE);
  }

  acceptTextHtml(): HeadersBuilder {
    return this.accept(TEXT_HTML_MIME_TYPE);
  }

  acceptEventStream(): HeadersBuilder {
    return this.accept(EVENT_STREAM_CONTENT_TYPE);
  }

  contentTypeJson(): HeadersBuilder {
    return this.contentType(JSON_MIME_TYPE);
  }

  contentTypeTextPlain(): HeadersBuilder {
    return this.contentType(TEXT_PLAIN_MIME_TYPE);
  }

  accept(mimeType: string): HeadersBuilder {
    return this.withHeader('accept', mimeType);
  }

  contentType(mimeType: string): HeadersBuilder {
    return this.withHeader('content-type', mimeType);
  }

  authorization(value: string): HeadersBuilder {
    return this.withHeader('authorization', value);
  }

  withHeader(header: string, value: string): HeadersBuilder {
    this._headers.set(header, value);
    return this;
  }

  build(): Headers {
    return this._headers;
  }
}
