/**
 * Where the new avatar comes from: an external service, or bytes the caller holds.
 */
export type UpdateProfileAvatarCommandInput =
  | UpdateProfileAvatarCommandInputExternal
  | UpdateProfileAvatarCommandInputData;

/**
 * Where the stored avatar can be fetched from.
 */
export interface UpdateProfileAvatarCommandOutput {
  /** URL of the avatar as it is now served. */
  url: string;
}

/**
 * Pulls the avatar from an external service the account is known on.
 */
export interface UpdateProfileAvatarCommandInputExternal {
  /** Discriminant of the source. */
  type: 'externalSource';
  /**
   * Service to pull the image from.
   * @sentAs `source`
   */
  source: 'github' | 'gravatar';
}

/**
 * Uploads the avatar as raw image bytes.
 */
export interface UpdateProfileAvatarCommandInputData {
  /** Discriminant of the source. */
  type: 'dataSource';
  /** Image format, sent as the request's `Content-Type`. */
  mimeType: 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/png' | 'image/tiff';
  /** The image itself, sent as the whole request body. */
  data: Blob;
}
