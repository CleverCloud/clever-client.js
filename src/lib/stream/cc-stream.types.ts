import type { CcRequest } from '../../types/request.types.js';
import type { SelfOrPromise } from '../../types/utils.types.js';
import type { CcClientError } from '../error/cc-client-errors.js';

/** Factory function that creates HTTP requests for streaming */
export type CcStreamRequestFactory = () => SelfOrPromise<CcRequest>;

/** Configuration options for CcStream instances */
export interface CcStreamConfig {
  /** Retry configuration (null to disable retries) */
  retry: RetryConfig | null;
  /** Expected period between heartbeat messages in milliseconds */
  heartbeatPeriod: number;
  /** Interval for checking connection health in milliseconds */
  healthcheckInterval: number;
  /** Enable debug logging for stream operations */
  isDebugEnabled: boolean;
}

/** Configuration options for CcStream instances where all properties are deeply optional */
export interface CcStreamConfigPartial extends Partial<Omit<CcStreamConfig, 'retry'>> {
  /** Retry configuration (null to disable retries) */
  retry?: Partial<RetryConfig> | null;
}

/** Configuration for retry behaviour on connection failures */
export interface RetryConfig {
  /** Multiplier for exponential backoff (e.g., 1.25 = 25% increase per retry) */
  backoffFactor: number;
  /** Initial retry delay in milliseconds */
  initRetryTimeout: number;
  /** Maximum number of retry attempts (use Infinity for unlimited) */
  maxRetryCount: number;
}

/**
 * Possible states of a CcStream
 *
 * `retrying` is the wait between a failed attempt and the next one, `paused` a pause its consumer asked for.
 */
export type CcStreamState = 'init' | 'connecting' | 'open' | 'retrying' | 'paused' | 'closed';

/** What a stream tells the listeners of its `retry` event, once its next attempt is scheduled */
export interface CcStreamRetry {
  /** The failure the stream retries after */
  error: CcClientError;
  /** The number of this retry, 1 for the first one: the value `CcStream.retryCount` holds until the next attempt */
  retryCount: number;
  /** The number of retries the stream makes before giving up (may be `Infinity`) */
  maxRetryCount: number;
  /** When the stream makes its next attempt */
  retryAt: Date;
}

/** Information about why a stream was closed */
export interface CcStreamCloseReason {
  /** The reason type for closing */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents -- 'UNKNOWN' documents the sentinel value while allowing arbitrary reason strings
  type: string | 'UNKNOWN';
}
