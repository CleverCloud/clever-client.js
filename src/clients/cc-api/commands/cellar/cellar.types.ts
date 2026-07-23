import type { AddonId } from '../../types/cc-api.types.js';

export type CellarStatus = 'ACTIVE' | 'TO_DELETE' | 'DELETING' | 'DELETED';

export interface CellarInfo {
  id: string;
  addonId: string;
  name: string;
  ownerId: string;
  plan: string;
  status: CellarStatus;
  // renamed from creationDate
  // transformed: converted to an ISO date string
  createdAt: string;
  traffic: {
    inbound: number;
    outbound: number;
  };
  buckets: {
    count: number;
    size: number;
    objects: number;
  };
}

export interface CellarCredentials {
  host: string;
  keyId: string;
  keySecret: string;
}

export interface CellarUrl {
  url: string;
}

export type CellarBucketResourceId = AddonId & {
  bucketName: string;
};

export type CellarObjectResourceId = CellarBucketResourceId & {
  objectKey: string;
};

export type CellarBucketVersioningStatus = 'ENABLED' | 'SUSPENDED' | 'DISABLED';

export interface CellarBucketSummary {
  name: string;
  objectsCount: number;
  sizeInBytes: number;
  createdAt: string;
  updatedAt: string;
}

// unlike CellarBucketSummary (list-buckets item), CellarBucket (get/create bucket) also carries versioning status
export interface CellarBucket extends CellarBucketSummary {
  versioning: CellarBucketVersioningStatus;
}

export interface CellarBucketList {
  buckets: Array<CellarBucketSummary>;
  total: number;
}

export interface CellarObjectItem {
  type: 'file';
  key: string;
  name: string;
  updatedAt: string;
  contentLength: number;
  eTag: string;
  // only present when the list request was made with withMetadata=true
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface CellarDirectory {
  type: 'directory';
  key: string;
  name: string;
}

export interface CellarObjectList {
  // renamed from content
  items: Array<CellarObjectItem>;
  directories: Array<CellarDirectory>;
  cursor: string | null;
}

export interface CellarTag {
  key: string;
  value: string;
}

export interface CellarGrantee {
  id: string;
  name: string;
  type: string;
}

export interface CellarAcl {
  grantee: CellarGrantee;
  permission: string;
}

export interface CellarObjectDetails {
  type: 'file';
  key: string;
  name: string;
  updatedAt: string;
  contentLength: number;
  eTag: string;
  contentType: string;
  tags: Array<CellarTag>;
  acl: Array<CellarAcl>;
  metadata: Record<string, string>;
}

export interface CellarSignedUrl {
  url: string;
  expiresAt: string;
}
