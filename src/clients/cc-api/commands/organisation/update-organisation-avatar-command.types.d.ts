export interface UpdateOrganisationAvatarCommandInput {
  organisationId: string;
  mimeType: 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/png' | 'image/tiff';
  data: Blob;
}

export interface UpdateOrganisationAvatarCommandOutput {
  url: string;
}
