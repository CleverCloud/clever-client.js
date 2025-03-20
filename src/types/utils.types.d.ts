export type Optionalize<T, Union extends keyof T> = Omit<T, Union> & Partial<Pick<T, Union>>;

export type SelfOrPromise<T> = T | Promise<T>;
