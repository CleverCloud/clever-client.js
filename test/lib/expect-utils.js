import { expect } from 'vitest';

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
  expect(err, 'An error was expected but not thrown').not.toBeNull();
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
  expect(err, 'An error was expected but not thrown').not.toBeNull();
  verify?.(err);
}

/**
 * @param {string} date
 */
export function checkDateFormat(date) {
  if (date != null) {
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/);
  }
}
