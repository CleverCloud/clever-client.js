import { expect } from 'chai';

/**
 * Takes in a function and checks for error
 * @param {Promise<?>} promise - The promise to await
 * @param {(err:any) => void} [verify] - Optional verifier with the error as argument
 */
export async function expectPromiseThrows(promise, verify) {
  let err = null;
  try {
    await promise;
  } catch (error) {
    err = error;
  }
  expect(err).not.to.equal(null, 'An error was expected but not thrown');
  verify?.(err);
}

/**
 * Takes in a function and checks for error
 * @param {function} fn - The function to check
 * @param {(err:any) => void} [verify] - Optional verifier with the error as argument
 */
export async function expectAsyncFunctionThrows(fn, verify) {
  let err = null;
  try {
    await fn();
  } catch (error) {
    err = error;
  }
  expect(err).not.to.equal(null, 'An error was expected but not thrown');
  verify?.(err);
}
