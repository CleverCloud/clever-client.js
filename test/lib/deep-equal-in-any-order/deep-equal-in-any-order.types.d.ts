export {};

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Matchers<T = any> {
    /**
     * Works like `toEqual` but doesn't check array order (at any level of nested objects and arrays).
     * The array elements can be any JS entity (boolean, null, number, string, object, array…).
     *
     * @param expected Potential expected value.
     */
    toEqualInAnyOrder: (expected: T) => T;
  }
}
