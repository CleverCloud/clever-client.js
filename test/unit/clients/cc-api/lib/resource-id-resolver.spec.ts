import { describe, expect, it, vi } from 'vitest';
import type { CcApiClient } from '../../../../../src/clients/cc-api/cc-api-client.js';
import type { GetOrganisationSummaryCommandOutput } from '../../../../../src/clients/cc-api/commands/organisation/get-organisation-summary-command.types.js';
import { ResourceIdResolver } from '../../../../../src/clients/cc-api/lib/resource-id-resolver.js';
import { MemoryStore } from '../../../../../src/clients/cc-api/lib/store/memory-store.js';
import type { ResourceIdIndex, Store } from '../../../../../src/clients/cc-api/types/resource-id-resolver.types.js';

/**
 * A summary holding a single organisation with one application and one add-on. Only the fields the
 * resolver indexes are set, so the fixture stays readable.
 */
const SUMMARY = {
  organisations: [
    {
      id: 'orga_1',
      isPersonal: false,
      applications: [{ id: 'app_1' }],
      addons: [{ id: 'addon_1', realId: 'real_1' }],
      providers: [{ id: 'provider_1' }],
      consumers: [{ key: 'consumer_1' }],
    },
  ],
} as GetOrganisationSummaryCommandOutput;

/**
 * A resolver wired to a client that answers every summary request with {@link SUMMARY}, after the
 * caller releases it. Holding the response open is what lets a test have several resolutions in
 * flight at the same time.
 */
function resolverWithDeferredClient(
  indexStore: Store<ResourceIdIndex> = new MemoryStore<ResourceIdIndex>(),
  getRequestSignal?: ConstructorParameters<typeof ResourceIdResolver>[2],
): {
  resolver: ResourceIdResolver;
  send: ReturnType<typeof vi.fn>;
  respond: () => void;
} {
  const pending: Array<() => void> = [];
  const send = vi.fn(
    () => new Promise<GetOrganisationSummaryCommandOutput>((resolve) => pending.push(() => resolve(SUMMARY))),
  );
  const client = { send } as unknown as CcApiClient;

  return {
    resolver: new ResourceIdResolver(client, indexStore, getRequestSignal),
    send,
    respond: () => pending.splice(0).forEach((resolve) => resolve()),
  };
}

describe('ResourceIdResolver', () => {
  it('should send a single summary request for concurrent resolutions of the same id', async () => {
    const { resolver, send, respond } = resolverWithDeferredClient();

    const resolutions = Promise.all([
      resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID'),
      resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID'),
    ]);
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    respond();

    await expect(resolutions).resolves.toEqual(['real_1', 'real_1']);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should send a single summary request for concurrent resolutions of different ids', async () => {
    const { resolver, send, respond } = resolverWithDeferredClient();

    const resolutions = Promise.all([
      resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID'),
      resolver.resolveOwnerId({ applicationId: 'app_1' }),
      resolver.resolveOwnerId({ addonProviderId: 'provider_1' }),
      resolver.resolveOwnerId({ oauthConsumerKey: 'consumer_1' }),
    ]);
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    respond();

    await expect(resolutions).resolves.toEqual(['real_1', 'orga_1', 'orga_1', 'orga_1']);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should read the index store once for concurrent resolutions', async () => {
    const indexStore = new MemoryStore<ResourceIdIndex>();
    const read = vi.spyOn(indexStore, 'read');
    const { resolver, send, respond } = resolverWithDeferredClient(indexStore);

    const resolutions = Promise.all([
      resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID'),
      resolver.resolveAddonId('real_1', 'ADDON_ID'),
    ]);
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    respond();

    await resolutions;
    expect(read).toHaveBeenCalledTimes(1);
  });

  it('should fail every concurrent resolution when the summary request fails', async () => {
    const send = vi.fn(() => Promise.reject(new Error('boom')));
    const resolver = new ResourceIdResolver({ send } as unknown as CcApiClient, new MemoryStore<ResourceIdIndex>());

    const resolutions = Promise.allSettled([
      resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID'),
      resolver.resolveAddonId('addon_2', 'REAL_ADDON_ID'),
    ]);

    expect(await resolutions).toEqual([
      { status: 'rejected', reason: new Error('boom') },
      { status: 'rejected', reason: new Error('boom') },
    ]);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should send a new summary request once the previous one settled', async () => {
    const { resolver, send, respond } = resolverWithDeferredClient();

    const first = resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID');
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    respond();
    await expect(first).resolves.toBe('real_1');

    // `addon_2` is not in the index the first request filled, so it needs a fresh summary
    const second = expect(resolver.resolveAddonId('addon_2', 'REAL_ADDON_ID')).rejects.toThrowError(
      "The addon with id addon_2 doesn't exist or you don't have access to it",
    );
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));
    respond();

    await second;
  });

  it('should not fail a concurrent resolution when another caller aborts', async () => {
    const { resolver, send, respond } = resolverWithDeferredClient();
    const abortController = new AbortController();

    const abortedResolution = resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID', { signal: abortController.signal });
    const keptResolution = resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID');
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    abortController.abort();
    respond();

    const [aborted, kept] = await Promise.allSettled([abortedResolution, keptResolution]);

    expect((aborted as PromiseRejectedResult).reason).toBe(abortController.signal.reason);
    expect(kept).toEqual({ status: 'fulfilled', value: 'real_1' });
    expect(send).toHaveBeenCalledTimes(1);
    // the request is shared, so the signal of the caller that started it must not reach it
    const requestSignal = (send.mock.calls[0][1] as { signal: AbortSignal }).signal;
    expect(requestSignal).not.toBe(abortController.signal);
    expect(requestSignal.aborted).toBe(false);
  });

  it('should abort the shared summary request once every caller aborted', async () => {
    const { resolver, send } = resolverWithDeferredClient();
    const abortController1 = new AbortController();
    const abortController2 = new AbortController();

    const resolution1 = resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID', { signal: abortController1.signal });
    const resolution2 = resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID', { signal: abortController2.signal });
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    const requestSignal = (send.mock.calls[0][1] as { signal: AbortSignal }).signal;

    abortController1.abort();
    await expect(resolution1).rejects.toBe(abortController1.signal.reason);
    // the second caller still waits for it
    expect(requestSignal.aborted).toBe(false);

    abortController2.abort();
    await expect(resolution2).rejects.toBe(abortController2.signal.reason);
    expect(requestSignal.aborted).toBe(true);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should send a new summary request for a caller arriving once every previous caller aborted', async () => {
    const { resolver, send, respond } = resolverWithDeferredClient();
    const abortController = new AbortController();

    const abortedResolution = resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID', { signal: abortController.signal });
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    abortController.abort();
    await expect(abortedResolution).rejects.toBe(abortController.signal.reason);

    // the aborted request is not joined, whatever becomes of it
    const newResolution = resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID');
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));
    respond();

    await expect(newResolution).resolves.toBe('real_1');
  });

  it('should not send the summary request for a caller that already aborted', async () => {
    const { resolver, send } = resolverWithDeferredClient();
    const reason = new Error('navigated away');

    await expect(
      resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID', { signal: AbortSignal.abort(reason) }),
    ).rejects.toBe(reason);
    expect(send).not.toHaveBeenCalled();
  });

  it('should let a caller relying on a default signal leave when it aborts, and abort the shared request', async () => {
    const defaultAbortController = new AbortController();
    const { resolver, send } = resolverWithDeferredClient(
      new MemoryStore<ResourceIdIndex>(),
      (requestConfig) => requestConfig?.signal ?? defaultAbortController.signal,
    );

    const resolution = resolver.resolveAddonId('addon_1', 'REAL_ADDON_ID');
    await vi.waitFor(() => expect(send).toHaveBeenCalled());
    const requestSignal = (send.mock.calls[0][1] as { signal: AbortSignal }).signal;

    defaultAbortController.abort();

    await expect(resolution).rejects.toBe(defaultAbortController.signal.reason);
    expect(requestSignal.aborted).toBe(true);
  });
});
