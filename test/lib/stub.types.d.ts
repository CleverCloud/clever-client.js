type FunctionLike = (...args: any[]) => any;
export type StubbedFunction<T> = T extends FunctionLike ? T : FunctionLike;
