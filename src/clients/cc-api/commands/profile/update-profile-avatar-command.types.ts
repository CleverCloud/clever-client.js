export type UpdateProfileAvatarCommandInput =
  | UpdateProfileAvatarCommandInputExternal
  | UpdateProfileAvatarCommandInputData;

export interface UpdateProfileAvatarCommandOutput {
  url: string;
}

export interface UpdateProfileAvatarCommandInputExternal {
  type: 'externalSource';
  source: 'github' | 'gravatar';
}

export interface UpdateProfileAvatarCommandInputData {
  type: 'dataSource';
  mimeType: 'image/bmp' | 'image/gif' | 'image/jpeg' | 'image/png' | 'image/tiff';
  data: Blob;
}
