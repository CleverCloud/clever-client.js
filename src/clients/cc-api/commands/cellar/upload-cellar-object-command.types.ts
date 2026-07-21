import type { CellarObjectResourceId } from './cellar.types.js';

export type UploadCellarObjectCommandInput = CellarObjectResourceId & {
  /**
   * The object content to store.
   *
   * A `Blob` (or a `File`) carries its own `type`, which is used as the content type of the uploaded object.
   */
  content: Blob | string;

  /**
   * The content type to store the object with.
   *
   * Defaults to the `type` of a `Blob` content, then to `application/octet-stream`.
   */
  contentType?: string;
};
