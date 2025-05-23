/**
 * @import { Stub } from 'hanbi';
 * @import { StubbedFunction } from './stub.types.js';
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

/**
 * @param {TObj} obj
 * @param {TKey} method
 * @returns {Stub<StubbedFunction<TObj[TKey]>>}
 * @template {object} TObj
 * @template {keyof TObj} TKey
 */
export function spyMethod(obj, method) {
  const stub = hanbi.stubMethod(obj, method);
  stub.passThrough();
  return stub;
}
