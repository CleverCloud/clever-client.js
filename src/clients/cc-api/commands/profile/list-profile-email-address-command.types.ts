export interface ListProfileEmailAddressCommandOutput {
  primaryAddress: ProfileEmailAddress;
  secondaryAddresses: Array<ProfileEmailAddress>;
}

export interface ProfileEmailAddress {
  address: string;
  isVerified: boolean;
}
