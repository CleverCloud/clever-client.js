export type QueryParams<T = string> = Record<string, OneOrMany<T>>;

export type OneOrMany<T> = T|Array<T>;
