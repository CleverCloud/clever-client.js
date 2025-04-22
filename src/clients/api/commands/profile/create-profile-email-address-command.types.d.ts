export interface CreateProfileEmailAddressCommandInput {
  emailAddress: string;
  primary: boolean;
}

export interface CreateProfileEmailAddressCommandOutput {
  email: string;
}
