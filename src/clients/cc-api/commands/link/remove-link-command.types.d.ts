import { ApplicationId } from '../../types/cc-api.types.js';

export type RemoveLinkCommandInput =
  | RemoveApplicationToApplicationLinkCommandInput
  | RemoveApplicationToAddonLinkCommandInput;

export interface RemoveApplicationToApplicationLinkCommandInput extends ApplicationId {
  targetApplicationId: string;
}
export interface RemoveApplicationToAddonLinkCommandInput extends ApplicationId {
  targetAddonId: string;
}
