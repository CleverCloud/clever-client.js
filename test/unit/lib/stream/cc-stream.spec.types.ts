import type { Mock } from 'vitest';
import type { CcStream } from '../../../../src/lib/stream/cc-stream.ts';
import type { CcStreamCloseReason, CcStreamRetry } from '../../../../src/lib/stream/cc-stream.types.ts';

export interface Stubs {
  request: Mock<() => void>;
  open: Mock<() => void>;
  retry: Mock<(retry: CcStreamRetry) => void>;
  event: Mock<(data: unknown) => void>;
  success: Mock<(reason: CcStreamCloseReason) => void>;
  failure: Mock<(err: unknown) => void>;
}

export interface SpiedStream {
  stream: CcStream;
  start: () => Promise<CcStreamCloseReason | undefined>;
  close: (reason: CcStreamCloseReason) => void;
  verifyCounts: (expectedCounts: Counts, maxWait?: number) => Promise<void>;
  stubs: Stubs;
}

type Counts = Partial<Record<keyof Stubs, number>>;
