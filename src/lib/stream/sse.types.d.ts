/**
 * Represents a Server-Sent Events message according to the SSE specification.
 * All fields are initialized as per the W3C EventSource specification.
 */
export interface SseMessage {
  /** The data payload of the message */
  data: string;
  /** The event type */
  event: string;
  /** Unique identifier for the message */
  id: string;
  /** Retry timeout in milliseconds (undefined if not specified) */
  retry: undefined | number;
}
