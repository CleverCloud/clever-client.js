import { expect } from 'vitest';
import { toEqualInAnyOrder } from '../lib/deep-equal-in-any-order/deep-equal-in-any-order.ts';

expect.extend({ toEqualInAnyOrder });
