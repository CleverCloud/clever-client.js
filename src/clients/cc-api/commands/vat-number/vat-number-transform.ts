import type { CheckVatNumberCommandOutput } from './check-vat-number-command.types.ts';

export function transformVatNumber(response: any): CheckVatNumberCommandOutput {
  if (response.valid) {
    return response;
  }
  return {
    valid: false,
  };
}
