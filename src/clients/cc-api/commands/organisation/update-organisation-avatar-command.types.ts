/**
 * Describes the image to use as the organisation avatar.
 */
export interface UpdateOrganisationAvatarCommandInput {
  /** Identifier of the organisation whose avatar is replaced. */
  organisationId: string;
  /** Media type of the image, sent as the `Content-Type` of the request. */
  mimeType: 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/png' | 'image/tiff';
  /** Raw image, sent as the request body. */
  data: Blob;
}

/**
 * Where the uploaded avatar can be fetched from.
 */
export interface UpdateOrganisationAvatarCommandOutput {
  /** URL the avatar is now served at. */
  url: string;
}
