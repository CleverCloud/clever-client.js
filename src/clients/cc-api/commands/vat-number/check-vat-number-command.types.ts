export interface CheckVatNumberCommandInput {
  country: string;
  vatNumber: string;
}

export type CheckVatNumberCommandOutput = CheckVatNumberValid | CheckVatNumberInvalid;

export interface CheckVatNumberValid {
  valid: true;
  name: string;
  address: string;
}

// transformed: reduced to the valid flag, an invalid number carries no name nor address
export interface CheckVatNumberInvalid {
  valid: false;
}
