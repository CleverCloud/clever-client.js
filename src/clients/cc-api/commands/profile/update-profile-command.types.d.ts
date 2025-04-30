import type { Profile } from './profile.types.js';

export interface UpdateProfileCommandInput {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipcode?: string;
  country?: string;
  lang?: string;
}

export type UpdateProfileCommandOutput = Profile;
