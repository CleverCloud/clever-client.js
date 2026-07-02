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

export interface CheckVatNumberInvalid {
  valid: false;
}
