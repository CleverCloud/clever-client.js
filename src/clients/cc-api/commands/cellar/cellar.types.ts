import type { AddonId } from '../../types/cc-api.types.js';

/**
 * Where a Cellar add-on stands in its lifecycle.
 */
export type CellarStatus = 'ACTIVE' | 'TO_DELETE' | 'DELETING' | 'DELETED';

/**
 * A Cellar add-on: the S3-compatible object storage, with how much of it is being used.
 */
export interface CellarInfo {
  /** Provider-side identifier of the Cellar instance. */
  id: string;
  /** Identifier of the add-on the instance belongs to. */
  addonId: string;
  /** Display name of the add-on. */
  name: string;
  /** Identifier of the user or organisation owning the add-on. */
  ownerId: string;
  /** Plan the instance runs on. */
  plan: string;
  /** Where the instance stands in its lifecycle. */
  status: CellarStatus;
  /**
   * When the instance was provisioned.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
  /** Traffic recorded over the current billing period. */
  traffic: {
    /** Bytes uploaded into Cellar. */
    inbound: number;
    /** Bytes downloaded out of Cellar. */
    outbound: number;
  };
  /** What the instance currently holds. */
  buckets: {
    /** Number of buckets. */
    count: number;
    /** Total size of the stored objects, in bytes. */
    size: number;
    /** Total number of stored objects. */
    objects: number;
  };
}

/**
 * The S3 credentials an S3 client needs to reach a Cellar add-on.
 */
export interface CellarCredentials {
  /** Cellar endpoint host to point the S3 client at. */
  host: string;
  /** S3 access key id. */
  keyId: string;
  /** S3 secret access key. */
  keySecret: string;
}

/**
 * A bare URL answer.
 */
export interface CellarUrl {
  /** The URL. */
  url: string;
}

/**
 * Identifies a bucket inside a Cellar add-on.
 */
export type CellarBucketResourceId = AddonId & {
  /** Name of the bucket. */
  bucketName: string;
};

/**
 * Identifies one object inside a bucket.
 */
export type CellarObjectResourceId = CellarBucketResourceId & {
  /** Full key of the object, slashes included. */
  objectKey: string;
};

/**
 * Whether a bucket keeps previous versions of its objects. `SUSPENDED` keeps the versions already
 * stored but stops creating new ones.
 */
export type CellarBucketVersioningStatus = 'ENABLED' | 'SUSPENDED' | 'DISABLED';

/**
 * A bucket as it appears in a listing.
 */
export interface CellarBucketSummary {
  /** Name of the bucket, unique within the add-on. */
  name: string;
  /** Number of objects stored in the bucket. */
  objectsCount: number;
  /** Total size of those objects, in bytes. */
  sizeInBytes: number;
  /** When the bucket was created, as an ISO date string. */
  createdAt: string;
  /** When the bucket was last written to, as an ISO date string. */
  updatedAt: string;
}

/**
 * A bucket read on its own. Unlike the listing entries, it also carries its versioning status.
 */
export interface CellarBucket extends CellarBucketSummary {
  /** Whether the bucket keeps previous versions of its objects. */
  versioning: CellarBucketVersioningStatus;
}

/**
 * The buckets of a Cellar add-on.
 */
export interface CellarBucketList {
  /** The buckets themselves. */
  buckets: Array<CellarBucketSummary>;
  /** Total number of buckets. */
  total: number;
}

/**
 * One stored object, as it appears in a bucket listing.
 */
export interface CellarObjectItem {
  /** Discriminant telling objects apart from directories in a listing. */
  type: 'file';
  /** Full key of the object, slashes included. */
  key: string;
  /** Last segment of the key, the part shown in a file browser. */
  name: string;
  /** When the object was last written, as an ISO date string. */
  updatedAt: string;
  /** Size of the object, in bytes. */
  contentLength: number;
  /** Entity tag of the object, usable for conditional requests. */
  eTag: string;
  /** MIME type of the object. Only present when the listing was asked for metadata. */
  contentType?: string;
  /** User metadata stored alongside the object. Only present when the listing was asked for metadata. */
  metadata?: Record<string, string>;
}

/**
 * A common key prefix, presented as a directory in a bucket listing.
 */
export interface CellarDirectory {
  /** Discriminant telling directories apart from objects in a listing. */
  type: 'directory';
  /** The prefix itself, slashes included. */
  key: string;
  /** Last segment of the prefix, the part shown in a file browser. */
  name: string;
}

/**
 * One page of a bucket listing, with the objects and the directories it holds.
 */
export interface CellarObjectList {
  /**
   * The objects on this page.
   * @renamedFrom `content`
   */
  items: Array<CellarObjectItem>;
  /** The directories on this page. */
  directories: Array<CellarDirectory>;
  /** Cursor to pass back to get the next page, `null` when the listing is exhausted. */
  cursor: string | null;
}

/**
 * One key and value pair attached to an object.
 */
export interface CellarTag {
  /** Tag key. */
  key: string;
  /** Tag value. */
  value: string;
}

/**
 * Who an access control entry grants a permission to.
 */
export interface CellarGrantee {
  /** Identifier of the grantee. */
  id: string;
  /** Display name of the grantee. */
  name: string;
  /** Kind of grantee, for example a canonical user or a predefined group. */
  type: string;
}

/**
 * One access control entry on an object: who may do what.
 */
export interface CellarAcl {
  /** Who the permission is granted to. */
  grantee: CellarGrantee;
  /** What they may do, for example `READ` or `FULL_CONTROL`. */
  permission: string;
}

/**
 * One stored object read on its own, with its tags, its access control list and its metadata.
 */
export interface CellarObjectDetails {
  /** Discriminant, kept so the shape lines up with the listing entries. */
  type: 'file';
  /** Full key of the object, slashes included. */
  key: string;
  /** Last segment of the key, the part shown in a file browser. */
  name: string;
  /** When the object was last written, as an ISO date string. */
  updatedAt: string;
  /** Size of the object, in bytes. */
  contentLength: number;
  /** Entity tag of the object, usable for conditional requests. */
  eTag: string;
  /** MIME type of the object. */
  contentType: string;
  /** Tags attached to the object. */
  tags: Array<CellarTag>;
  /** Access control entries on the object. */
  acl: Array<CellarAcl>;
  /** User metadata stored alongside the object. */
  metadata: Record<string, string>;
}

/**
 * A presigned URL, usable without credentials until it expires.
 */
export interface CellarSignedUrl {
  /** The presigned URL. */
  url: string;
  /** When the URL stops working, as an ISO date string. */
  expiresAt: string;
}
