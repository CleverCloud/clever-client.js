export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type SelfOrPromise<T> = T | Promise<T>;

// export type Clazz<T> = {
//   constructor(any?: any): T;
// };

type Clazz<T> = new (...args: any[]) => T;
