export interface RetryConfiguration {
  enabled?: boolean;
  backoffFactor?: number;
  initRetryTimeout?: number;
  maxRetryCount?: number;
}

export interface SseCloseReason {
  type: string | 'UNKNOWN';
}

export interface SseMessage {
  data: string;
  event: string;
  id: string;
  retry: undefined | number;
}

export interface SseFetchEventSourceParams extends RequestInit {
  abortController: AbortController;
  headers: Record<string, string>;
  onOpen: (response: Response) => Promise<void>;
  onMessage: (message: SseMessage) => void;
  onClose: (reason?: any) => void;
  onError: (error: any) => void;
  resumeFrom: string;
}

export interface AutoRetry {
  counter: number;
  backoffFactor: number;
  initRetryTimeout: number;
  pingTimeoutFactor: number;
  maxRetryCount: number;
  timeoutId?: any;
}
