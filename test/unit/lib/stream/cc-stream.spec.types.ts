import type { Mock } from 'vitest';
import type { CcStream } from '../../../../src/lib/stream/cc-stream.js';
import type { CcStreamCloseReason } from '../../../../src/lib/stream/cc-stream.types.js';

export interface Stubs {
  request: Mock<() => void>;
  open: Mock<() => void>;
  error: Mock<(err: unknown) => void>;
  event: Mock<(data: unknown) => void>;
  success: Mock<(reason: CcStreamCloseReason) => void>;
  failure: Mock<(err: unknown) => void>;
}

export interface SpiedStream {
  stream: CcStream;
  start: () => Promise<CcStreamCloseReason>;
  close: (reason: CcStreamCloseReason) => void;
  verifyCounts: (expectedCounts: Counts, maxWait?: number) => Promise<void>;
  stubs: Stubs;
}

type Counts = Partial<Record<keyof Stubs, number>>;
