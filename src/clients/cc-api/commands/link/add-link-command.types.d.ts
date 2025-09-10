import { ApplicationId } from '../../types/cc-api.types.js';

export type AddLinkCommandInput = AddApplicationToApplicationLinkCommandInput | AddApplicationToAddonLinkCommandInput;

export interface AddApplicationToApplicationLinkCommandInput extends ApplicationId {
  targetApplicationId: string;
}
export interface AddApplicationToAddonLinkCommandInput extends ApplicationId {
  targetAddonId: string;
}
