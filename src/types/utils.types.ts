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

/**
 * The variant a discriminated union publishes for a value the client does not know, because the API
 * gained it after the client shipped.
 *
 * @template Discriminant - The key the union discriminates on, `type` for most of them
 *
 * @example
 * type Target = TargetEmail | TargetUser | UnknownToClient;
 * // A target the client cannot map: { type: 'UNKNOWN_TO_CLIENT', payload: <what the API sent> }
 *
 * @example
 * type Event = ClusterStatusEvent | NodeLifecycleEvent | UnknownToClient<'event'>;
 * // An event the client cannot map: { event: 'UNKNOWN_TO_CLIENT', payload: <what the API sent> }
 */
export type UnknownToClient<Discriminant extends string = 'type'> = {
  [K in Discriminant]: 'UNKNOWN_TO_CLIENT';
} & {
  /** The payload as the API sent it, so a caller can still read what the client could not map. */
  payload: unknown;
};

/**
 * The members of a discriminated union the client does know, with {@link UnknownToClient} taken out.
 *
 * A union that carries the unknown variant forces every caller to handle it, which is the point. A
 * caller that has already dealt with it, or that filters it out of a list, names the rest with this.
 *
 * @template T - The discriminated union to narrow
 * @template Discriminant - The key the union discriminates on, `type` for most of them
 *
 * @example
 * type Target = TargetEmail | TargetUser | UnknownToClient;
 * type KnownTarget = Known<Target>;
 * // Result: TargetEmail | TargetUser
 *
 * @example
 * type Event = ClusterStatusEvent | NodeLifecycleEvent | UnknownToClient<'event'>;
 * type KnownEvent = Known<Event, 'event'>;
 * // Result: ClusterStatusEvent | NodeLifecycleEvent
 */
export type Known<T, Discriminant extends string = 'type'> = Exclude<T, UnknownToClient<Discriminant>>;
