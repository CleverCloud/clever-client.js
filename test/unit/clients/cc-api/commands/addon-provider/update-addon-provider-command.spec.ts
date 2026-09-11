import { describe, expect, it } from 'vitest';
import { UpdateAddonProviderCommand } from '../../../../../../src/clients/cc-api/commands/addon-provider/update-addon-provider-command.js';
import type { UpdateAddonProviderCommandInput } from '../../../../../../src/clients/cc-api/commands/addon-provider/update-addon-provider-command.types.js';

/** The body as `getRequestBody()` serialises it, so an `undefined` field disappears. */
function bodySentFor(params: UpdateAddonProviderCommandInput): unknown {
  const requestParams = new UpdateAddonProviderCommand(params).toRequestParams(params);
  return JSON.parse(JSON.stringify(requestParams.body));
}

describe('UpdateAddonProviderCommand', () => {
  it('should send every documented field under its payload key', () => {
    const body = bodySentFor({
      ownerId: 'orga_x',
      addonProviderId: 'my-service-addon',
      name: 'My Service',
      website: 'https://example.com',
      supportEmail: 'support@example.com',
      googlePlusName: 'my-service',
      twitterName: 'myservice',
      analyticsId: 'UA-1',
      shortDescription: 'A short one',
      longDescription: 'A longer one',
      logoUrl: 'https://example.com/logo.svg',
    });

    expect(body).toEqual({
      name: 'My Service',
      website: 'https://example.com',
      supportEmail: 'support@example.com',
      googlePlusName: 'my-service',
      twitterName: 'myservice',
      analyticsId: 'UA-1',
      shortDesc: 'A short one',
      longDesc: 'A longer one',
      logoUrl: 'https://example.com/logo.svg',
    });
  });

  it('should leave out the fields the caller did not set', () => {
    const body = bodySentFor({ ownerId: 'orga_x', addonProviderId: 'my-service-addon', name: 'My Service' });

    expect(body).toEqual({ name: 'My Service' });
  });

  // an untyped caller can attach anything to the input object, and none of it belongs on the wire
  it('should keep a property it does not document out of the body', () => {
    const body = bodySentFor({
      ownerId: 'orga_x',
      addonProviderId: 'my-service-addon',
      name: 'My Service',
      status: 'RELEASE',
      plans: [{ id: 'plan_x' }],
    } as UpdateAddonProviderCommandInput);

    expect(body).toEqual({ name: 'My Service' });
  });
});
