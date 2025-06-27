import { Organisation } from './organisation.types.js';

export interface GetOrganisationCommandInput {
  organisationId: string;
}

export type GetOrganisationCommandOutput = Organisation;
