export interface OwnerIdIndex {
  applicationIds: Record<string, string>;
  addonIds: Record<string, string>;
  addonRealIds: Record<string, string>;
}

export interface Store<T> {
  write(index: T): Promise<void>;
  read(): Promise<T>;
  flush(): Promise<void>;
}
