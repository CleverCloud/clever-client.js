import type { CellarBucketResourceId } from './cellar.types.js';

export interface DeleteCellarBucketCommandInput extends CellarBucketResourceId {
  purgeObjects?: boolean;
}
