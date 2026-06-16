import { expect } from 'vitest';
import { toEqualInAnyOrder } from '../lib/deep-equal-in-any-order/deep-equal-in-any-order.js';

expect.extend({ toEqualInAnyOrder });
