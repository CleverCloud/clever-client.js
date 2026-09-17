import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CcApiClient } from '../../../../src/clients/cc-api/cc-api-client.js';
import {
  GetApplicationCommand,
  GetApplicationInnerCommand,
} from '../../../../src/clients/cc-api/commands/application/get-application-command.js';
import type { GetApplicationCommandOutput } from '../../../../src/clients/cc-api/commands/application/get-application-command.types.js';
import { GetOrganisationSummaryCommand } from '../../../../src/clients/cc-api/commands/organisation/get-organisation-summary-command.js';
import type { GetOrganisationSummaryCommandOutput } from '../../../../src/clients/cc-api/commands/organisation/get-organisation-summary-command.types.js';
import { MemoryStore } from '../../../../src/clients/cc-api/lib/store/memory-store.js';
import type { ResourceIdIndex } from '../../../../src/clients/cc-api/types/resource-id-resolver.types.js';
import type { CcRequestConfigPartial } from '../../../../src/types/request.types.js';
import { expectPromiseThrows } from '../../../lib/expect-utils.js';
import { sleep } from '../../../lib/timers.js';

/**
 * A summary holding a single organisation with one application. Only the fields the resolver indexes
 * are set, so the fixture stays readable.
 */
const SUMMARY = {
  organisations: [
    {
      id: 'orga_1',
      isPersonal: false,
      applications: [{ id: 'app_1' }],
      addons: [],
      providers: [],
      consumers: [],
    },
  ],
} as unknown as GetOrganisationSummaryCommandOutput;

const APPLICATION = { id: 'app_1' } as GetApplicationCommandOutput;

describe('CcApiClient', () => {
  let newScenario: NewScenario;

  const hooks = doublureHooks();

  beforeAll(async () => {
    newScenario = await hooks.before();
  });
  beforeEach(hooks.beforeEach);
  afterEach(() => {
    vi.restoreAllMocks();
  });
  afterAll(hooks.after);

  function createClient(onError: (error: unknown) => void, defaultRequestConfig?: CcRequestConfigPartial): CcApiClient {
    return new CcApiClient({
      baseUrl: newScenario.mockClient.baseUrl,
      resourceIdResolverStore: new MemoryStore<ResourceIdIndex>(),
      hooks: { onError },
      defaultRequestConfig,
    });
  }

  describe('onError hook', () => {
    it('should be called once when resolving the owner id of a command fails', async () => {
      const spy = vi.fn();
      const client = createClient(spy);

      await newScenario()
        .when({ method: 'GET', path: '/v2/summary' })
        .respond({ status: 500, body: 'A server error occurred' });

      await expectPromiseThrows(client.send(new GetApplicationCommand({ applicationId: 'app_1' })), (err) => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe(err);
      });
    });

    it('should be called when resolving an owner id directly through the resolver fails', async () => {
      const spy = vi.fn();
      const client = createClient(spy);

      await newScenario()
        .when({ method: 'GET', path: '/v2/summary' })
        .respond({ status: 500, body: 'A server error occurred' });

      await expectPromiseThrows(client.resourceIdResolver.resolveOwnerId({ applicationId: 'app_1' }), (err) => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0]).toBe(err);
      });
    });
  });

  describe('resource id resolution', () => {
    it('should not fail a command when another command resolving the same id at the same time aborts', async () => {
      const spy = vi.fn();
      const client = createClient(spy);
      vi.spyOn(GetOrganisationSummaryCommand.prototype, 'transformCommandOutput').mockReturnValue(SUMMARY);
      vi.spyOn(GetApplicationInnerCommand.prototype, 'transformCommandOutput').mockReturnValue(APPLICATION);

      await newScenario()
        .when({ method: 'GET', path: '/v2/summary' })
        .respond({ status: 200, body: {} }, 50)
        .when({ method: 'GET', path: '/v2/organisations/orga_1/applications/app_1' })
        .respond({ status: 200, body: {} });

      const abortController = new AbortController();
      const abortedPromise = client.send(new GetApplicationCommand({ applicationId: 'app_1' }), {
        signal: abortController.signal,
      });
      const keptPromise = client.send(new GetApplicationCommand({ applicationId: 'app_1' }));
      setTimeout(() => abortController.abort(), 10);

      const [aborted, kept] = await Promise.allSettled([abortedPromise, keptPromise]);

      expect((aborted as PromiseRejectedResult).reason).toBe(abortController.signal.reason);
      expect(kept).toEqual({ status: 'fulfilled', value: APPLICATION });
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call `onError` hook when the id resolution fails once every command waiting for it aborted', async () => {
      const spy = vi.fn();
      const client = createClient(spy);

      await newScenario()
        .when({ method: 'GET', path: '/v2/summary' })
        .respond({ status: 500, body: 'A server error occurred' }, 50);

      const abortController = new AbortController();
      const reason = new Error('navigated away');
      const abortedPromise = client.send(new GetApplicationCommand({ applicationId: 'app_1' }), {
        signal: abortController.signal,
      });
      setTimeout(() => abortController.abort(reason), 10);

      await expect(abortedPromise).rejects.toBe(reason);
      // leave the summary the time to answer, had nobody aborted it
      await sleep(80);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should reject a command relying on the default signal of the client when it aborts, without calling `onError` hook', async () => {
      const spy = vi.fn();
      const clientAbortController = new AbortController();
      const client = createClient(spy, { signal: clientAbortController.signal });
      const reason = new Error('client closed');

      await newScenario()
        .when({ method: 'GET', path: '/v2/summary' })
        .respond({ status: 500, body: 'A server error occurred' }, 50);

      const promise = client.send(new GetApplicationCommand({ applicationId: 'app_1' }));
      setTimeout(() => clientAbortController.abort(reason), 10);

      await expect(promise).rejects.toBe(reason);
      // leave the summary the time to answer, had nobody aborted it
      await sleep(80);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should keep resolving an id for a command with a signal of its own when the default signal of the client aborts', async () => {
      const spy = vi.fn();
      const clientAbortController = new AbortController();
      const client = createClient(spy, { signal: clientAbortController.signal });
      vi.spyOn(GetOrganisationSummaryCommand.prototype, 'transformCommandOutput').mockReturnValue(SUMMARY);
      vi.spyOn(GetApplicationInnerCommand.prototype, 'transformCommandOutput').mockReturnValue(APPLICATION);

      await newScenario()
        .when({ method: 'GET', path: '/v2/summary' })
        .respond({ status: 200, body: {} }, 50)
        .when({ method: 'GET', path: '/v2/organisations/orga_1/applications/app_1' })
        .respond({ status: 200, body: {} });

      const reason = new Error('client closed');
      const relyingOnClientPromise = client.send(new GetApplicationCommand({ applicationId: 'app_1' }));
      const withOwnSignalPromise = client.send(new GetApplicationCommand({ applicationId: 'app_1' }), {
        signal: new AbortController().signal,
      });
      setTimeout(() => clientAbortController.abort(reason), 10);

      const [relyingOnClient, withOwnSignal] = await Promise.allSettled([relyingOnClientPromise, withOwnSignalPromise]);

      expect((relyingOnClient as PromiseRejectedResult).reason).toBe(reason);
      // a signal of its own is not subject to the default one, so the summary goes on for it
      expect(withOwnSignal).toEqual({ status: 'fulfilled', value: APPLICATION });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
