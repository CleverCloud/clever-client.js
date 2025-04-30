export interface ResourceIdIndex {
  ownerIdIndex: OwnerIdIndex;
  addonsIndex: AddonIdIndex;
}

export interface OwnerIdIndex {
  applicationIds: Record<string, string>;
  addonIds: Record<string, string>;
  addonRealIds: Record<string, string>;
  addonProviderIds: Record<string, string>;
  oauthConsumerIds: Record<string, string>;
}

export interface AddonIdIndex {
  addonIds: Record<string, string>;
  addonRealIds: Record<string, string>;
}

export interface Store<T> {
  write(index: T): Promise<void>;
  read(): Promise<T>;
  flush(): Promise<void>;
}

export interface IdResolve {
  ownerId?: boolean;
  addonId?: AddonIdType | AddonIdResolve;
}
export type AddonIdType = 'ADDON_ID' | 'REAL_ADDON_ID';
export type AddonIdResolve = {
  property: string;
  type: AddonIdType;
};
