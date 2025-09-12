import type { CcRequest } from '../../types/request.types.js';
import type { SelfOrPromise } from '../../types/utils.types.js';

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
  debug: boolean;
}

/** Configuration options for CcStream instances where all properties are deeply optional */
export interface CcStreamConfigPartial extends Partial<CcStreamConfig> {
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

/** Possible states of a CcStream */
export type CcStreamState = 'init' | 'connecting' | 'open' | 'paused' | 'closed';

/** Information about why a stream was closed */
export interface CcStreamCloseReason {
  /** The reason type for closing */
  type: string | 'UNKNOWN';
}
