/**
 * @import { Stub } from 'hanbi';
 */
import * as hanbi from 'hanbi';

/**
 * Thin wrapper around hanbi stubs
 *
 * @param {T} fn
 * @returns {Stub<T>}
 * @template {(...args: any[]) => any} T
 */
export function createStub(fn) {
  const stub = hanbi.stub(fn);
  if (fn != null) {
    stub.passThrough();
  }
  return stub;
}
