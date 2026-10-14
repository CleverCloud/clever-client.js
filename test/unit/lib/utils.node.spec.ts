import { getEventListeners } from 'node:events';
import { describe, expect, it } from 'vitest';
import { combineWithSignal } from '../../../src/lib/utils.js';

// listeners of a signal can only be counted in Node
describe('combineWithSignal', () => {
  it('should stop listening to the signal once the controller aborts', () => {
    const parent = new AbortController();
    const controllers = Array.from({ length: 3 }, () => new AbortController());
    controllers.forEach((controller) => combineWithSignal(controller, parent.signal));
    expect(getEventListeners(parent.signal, 'abort')).toHaveLength(3);

    controllers.forEach((controller) => controller.abort());

    expect(getEventListeners(parent.signal, 'abort')).toHaveLength(0);
  });
});
