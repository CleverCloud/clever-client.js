/**
 * Makes specified properties of a type optional while keeping others required.
 *
 * @template T - The original type
 * @template K - Keys of T to make optional
 *
 * @example
 * type User = { name: string; age: number; email: string; }
 * type UserWithOptionalEmail = WithOptional<User, 'email'>;
 * // Result: { name: string; age: number; email?: string; }
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Makes specified properties of a type required by removing optional modifiers.
 *
 * @template T - The original type
 * @template K - Keys of T to make required
 *
 * @example
 * type User = { name?: string; age?: number; }
 * type RequiredUser = WithRequired<User, 'name'>;
 * // Result: { name: string; age?: number; }
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Represents a value that can be either the value itself or a Promise of that value.
 * Used for functions that can return either synchronously or asynchronously.
 *
 * @template T - The type of the value
 *
 * @example
 * type Result = SelfOrPromise<number>;
 * // Can be: number | Promise<number>
 */
export type SelfOrPromise<T> = T | Promise<T>;

/**
 * Represents a value that can be either a single item or an array of items.
 * Useful for parameters that accept either one or multiple values.
 *
 * @template T - The type of the item(s)
 *
 * @example
 * type IdParam = OneOrMany<string>;
 * // Can be: string | string[]
 */
export type OneOrMany<T> = T | Array<T>;
