import type { NewScenario } from '@clevercloud/doublure';
import { doublureHooks } from '@clevercloud/doublure/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { CcApiClient } from '../../../../src/clients/cc-api/cc-api-client.js';
import { GetApplicationCommand } from '../../../../src/clients/cc-api/commands/application/get-application-command.js';
import { MemoryStore } from '../../../../src/clients/cc-api/lib/store/memory-store.js';
import type { ResourceIdIndex } from '../../../../src/clients/cc-api/types/resource-id-resolver.types.js';
import { expectPromiseThrows } from '../../../lib/expect-utils.js';

describe('CcApiClient', () => {
  let newScenario: NewScenario;

  const hooks = doublureHooks();

  beforeAll(async () => {
    newScenario = await hooks.before();
  });
  beforeEach(hooks.beforeEach);
  afterAll(hooks.after);

  function createClient(onError: (error: unknown) => void): CcApiClient {
    return new CcApiClient({
      baseUrl: newScenario.mockClient.baseUrl,
      resourceIdResolverStore: new MemoryStore<ResourceIdIndex>(),
      hooks: { onError },
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
});
