import { afterEach, describe, expect, it } from 'vitest';
import type { ApiToken } from '../../../../../src/clients/cc-api-bridge/commands/api-token/api-token.types.js';
import { CreateApiTokenCommand } from '../../../../../src/clients/cc-api-bridge/commands/api-token/create-api-token-command.js';
import { DeleteApiTokenCommand } from '../../../../../src/clients/cc-api-bridge/commands/api-token/delete-api-token-command.js';
import { ListApiTokenCommand } from '../../../../../src/clients/cc-api-bridge/commands/api-token/list-api-token-command.js';
import { UpdateApiTokenCommand } from '../../../../../src/clients/cc-api-bridge/commands/api-token/update-api-token-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('api-token commands', function () {
  const support = e2eSupport();

  let createdTokenId: string | null = null;

  afterEach(async () => {
    if (createdTokenId != null) {
      await support.client.send(new DeleteApiTokenCommand({ apiTokenId: createdTokenId }));
    }
  });

  // we cannot split each test into multiple `it` because token creation cannot be done too fast
  it('should create, list, update, and delete api token', async () => {
    // create token
    const tokenCreated = await support.clientForCreate.send(
      new CreateApiTokenCommand({
        name: 'test-api-token',
        description: 'test description',
        email: support.email,
        password: support.password,
        expirationDate: new Date(new Date().getTime() + 1000 * 60 * 2),
      }),
    );
    createdTokenId = tokenCreated.apiTokenId;

    expect(tokenCreated.apiToken).toBeTypeOf('string');
    expect(tokenCreated.apiTokenId).toBeTypeOf('string');
    expect(tokenCreated.name).toBe('test-api-token');
    expect(tokenCreated.description).toBe('test description');
    expect(tokenCreated.creationDate).toBe(new Date(tokenCreated.creationDate).toISOString());
    expect(tokenCreated.expirationDate).toBe(new Date(tokenCreated.expirationDate).toISOString());
    expect(tokenCreated.state).toBe('ACTIVE');

    // list
    const listResponse = await support.client.send(new ListApiTokenCommand());

    expect(listResponse).toBeInstanceOf(Array);
    expect(listResponse).toHaveLength(2);
    expect(listResponse.map((t) => t.apiTokenId)).toContain(tokenCreated.apiTokenId);
    const tokenFormList = listResponse.find((t) => t.apiTokenId === tokenCreated.apiTokenId);
    expect(tokenFormList.name).toBe(tokenCreated.name);
    expect(tokenFormList.description).toBe(tokenCreated.description);
    expect(tokenFormList.userId).toBeTypeOf('string');
    expect(tokenFormList.creationDate).toBe(tokenCreated.creationDate);
    expect(tokenFormList.expirationDate).toBe(tokenCreated.expirationDate);
    expect(tokenFormList.ip).toBeTypeOf('string');
    expect(tokenFormList.state).toBe('ACTIVE');

    // update
    const updateResponse = await support.client.send(
      new UpdateApiTokenCommand({
        apiTokenId: tokenCreated.apiTokenId,
        name: 'test-api-token-updated',
        description: 'test description updated',
      }),
    );

    expect(updateResponse).toBeNull();
    const apiTokenUpdated = await getApiToken(tokenCreated.apiTokenId);
    expect(apiTokenUpdated.name).toBe('test-api-token-updated');
    expect(apiTokenUpdated.description).toBe('test description updated');

    // delete
    const deleteResponse = await support.client.send(
      new DeleteApiTokenCommand({ apiTokenId: tokenCreated.apiTokenId }),
    );
    expect(deleteResponse).toBeNull();
    const apiTokenDeleted = await getApiToken(tokenCreated.apiTokenId);
    expect(apiTokenDeleted).toBeUndefined();
    createdTokenId = null;
  });

  async function getApiToken(tokenId: string): Promise<ApiToken> {
    const listResponse = await support.client.send(new ListApiTokenCommand());
    return listResponse.find((t) => t.apiTokenId === tokenId);
  }
});
