import type { CcStream } from '../../../lib/stream/cc-stream.ts';
import type { CcClientParamsTransformer } from '../../../types/client.types.ts';
import type { CcRequestConfigPartial } from '../../../types/request.types.ts';
import type { CcApiType, ResourceId } from '../types/cc-api.types.ts';
import type { AddonIdResolve } from '../types/resource-id-resolver.types.ts';
import type { CcApiCompositeCommand, CcApiSimpleCommand, CcApiStreamCommand } from './cc-api-command.ts';
import type { ResourceIdResolver } from './resource-id-resolver.ts';

/**
 * Resolves the resource ids a command declares (owner ids, addon ids) to the format its endpoint expects.
 */
export class CcApiParamsTransformer implements CcClientParamsTransformer<CcApiType> {
  /**
   * Gets the resolver of the client, which only exists once the client is constructed
   */
  readonly #getResourceIdResolver: () => ResourceIdResolver;

  /**
   * @param getResourceIdResolver - Gets the resource id resolver of the client
   */
  constructor(getResourceIdResolver: () => ResourceIdResolver) {
    this.#getResourceIdResolver = getResourceIdResolver;
  }

  /**
   * Resolves the resource ids declared by `command.getIdsToResolve()` in the params of the command.
   *
   * @param command - The command being sent
   * @param requestConfig - The request configuration the command is sent with
   * @returns The params, with their ids resolved
   */
  async transformParams(
    command:
      | CcApiSimpleCommand<unknown, unknown>
      | CcApiCompositeCommand<unknown, unknown>
      | CcApiStreamCommand<unknown, CcStream>,
    requestConfig: CcRequestConfigPartial | undefined,
  ): Promise<unknown> {
    const params = command.params;
    const idsToResolve = command.getIdsToResolve();

    if (idsToResolve == null) {
      return params;
    }

    const resourceIdResolver = this.#getResourceIdResolver();
    const resolvedIds: Record<string, string> = {};

    if (idsToResolve.ownerId) {
      resolvedIds.ownerId = await resourceIdResolver.resolveOwnerId(params as ResourceId, requestConfig);
    }

    if (idsToResolve.addonId != null) {
      const addonIdResolve: AddonIdResolve =
        typeof idsToResolve.addonId === 'string'
          ? {
              property: 'addonId',
              type: idsToResolve.addonId,
            }
          : idsToResolve.addonId;

      const rawAddonId = (params as Record<string, string>)[addonIdResolve.property];
      if (rawAddonId != null) {
        resolvedIds[addonIdResolve.property] = await resourceIdResolver.resolveAddonId(
          rawAddonId,
          addonIdResolve.type,
          requestConfig,
        );
      }
    }

    return { ...(params as Record<string, unknown>), ...resolvedIds };
  }
}
