// Vitest custom matcher port of https://github.com/oprogramador/deep-equal-in-any-order without lodash.
import type { ExpectationResult, MatcherState } from '@vitest/expect';
import { sortAny } from './sort-any.js';

function sortDeep(object: unknown): unknown {
  if (object instanceof Map) {
    return sortAny([...object]);
  }
  if (!Array.isArray(object)) {
    if (typeof object !== 'object' || object == null || object instanceof Date) {
      return object;
    }

    return Object.fromEntries(Object.entries(object as Record<string, unknown>).map(([k, v]) => [k, sortDeep(v)]));
  }
  return sortAny(object.map(sortDeep));
}

/**
 * Vitest matcher: behaves like `toEqual` but ignores array order at any level of nesting.
 *
 * Register it once via `expect.extend({ toEqualInAnyOrder })` (done in `test/setup/matchers.js`).
 */
export function toEqualInAnyOrder(this: MatcherState, received: unknown, expected: unknown): ExpectationResult {
  const pass = this.equals(sortDeep(received), sortDeep(expected));

  return {
    pass,
    message: () =>
      `expected ${this.utils.printReceived(received)} to ${pass ? 'not ' : ''}equal ${this.utils.printExpected(
        expected,
      )} in any order`,
    actual: received,
    expected,
  };
}
