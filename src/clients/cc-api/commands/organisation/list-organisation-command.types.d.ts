import { Organisation } from './organisation.types.js';

export interface ListOrganisationCommandInput {
  withPersonalOrganisation: boolean;
}

export type ListOrganisationCommandOutput = Array<Organisation>;
