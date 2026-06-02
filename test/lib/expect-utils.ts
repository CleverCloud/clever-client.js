import { expect } from 'vitest';

/**
 * Takes in a promise and checks for error
 * @param promise - The promise to await
 * @param verify - Optional verifier with the error as argument
 */
export async function expectPromiseThrows<E = unknown>(
  promise: Promise<unknown>,
  verify?: (err: E) => void,
): Promise<void> {
  let err: unknown = null;
  try {
    await promise;
  } catch (error) {
    err = error;
  }
  expect(err, 'An error was expected but not thrown').not.toBeNull();
  verify?.(err as E);
}

/**
 * Takes in a function and checks for error
 * @param fn - The function to check
 * @param verify - Optional verifier with the error as argument
 */
export async function expectAsyncFunctionThrows<E = unknown>(
  fn: () => unknown,
  verify?: (err: E) => void,
): Promise<void> {
  let err: unknown = null;
  try {
    await fn();
  } catch (error) {
    err = error;
  }
  expect(err, 'An error was expected but not thrown').not.toBeNull();
  verify?.(err as E);
}

export function checkDateFormat(date: string): void {
  if (date != null) {
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/);
  }
}
