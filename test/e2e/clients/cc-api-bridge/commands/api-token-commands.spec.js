/**
 * @import { ApiToken } from '../../../../../src/clients/cc-api-bridge/commands/api-token/api-token.types.js'
 */
import { expect } from 'chai';
import { CreateApiTokenCommand } from '../../../../../src/clients/cc-api-bridge/commands/api-token/create-api-token-command.js';
import { DeleteApiTokenCommand } from '../../../../../src/clients/cc-api-bridge/commands/api-token/delete-api-token-command.js';
import { ListApiTokenCommand } from '../../../../../src/clients/cc-api-bridge/commands/api-token/list-api-token-command.js';
import { UpdateApiTokenCommand } from '../../../../../src/clients/cc-api-bridge/commands/api-token/update-api-token-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('api-token commands', function () {
  const support = e2eSupport();

  /** @type {null|string} */
  let createdTokenId = null;

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

    expect(tokenCreated.apiToken).to.be.a('string');
    expect(tokenCreated.apiTokenId).to.be.a('string');
    expect(tokenCreated.name).to.equal('test-api-token');
    expect(tokenCreated.description).to.equal('test description');
    expect(tokenCreated.creationDate).to.equal(new Date(tokenCreated.creationDate).toISOString());
    expect(tokenCreated.expirationDate).to.equal(new Date(tokenCreated.expirationDate).toISOString());
    expect(tokenCreated.state).to.equal('ACTIVE');

    // list
    const listResponse = await support.client.send(new ListApiTokenCommand());

    expect(listResponse).to.be.an('array').of.length(2);
    expect(listResponse.map((t) => t.apiTokenId)).to.contain(tokenCreated.apiTokenId);
    const tokenFormList = listResponse.find((t) => t.apiTokenId === tokenCreated.apiTokenId);
    expect(tokenFormList.name).to.equal(tokenCreated.name);
    expect(tokenFormList.description).to.equal(tokenCreated.description);
    expect(tokenFormList.userId).to.be.a('string');
    expect(tokenFormList.creationDate).to.equal(tokenCreated.creationDate);
    expect(tokenFormList.expirationDate).to.equal(tokenCreated.expirationDate);
    expect(tokenFormList.ip).to.be.a('string');
    expect(tokenFormList.state).to.equal('ACTIVE');

    // update
    const updateResponse = await support.client.send(
      new UpdateApiTokenCommand({
        apiTokenId: tokenCreated.apiTokenId,
        name: 'test-api-token-updated',
        description: 'test description updated',
      }),
    );

    expect(updateResponse).to.be.null;
    const apiTokenUpdated = await getApiToken(tokenCreated.apiTokenId);
    expect(apiTokenUpdated.name).to.equal('test-api-token-updated');
    expect(apiTokenUpdated.description).to.equal('test description updated');

    // delete
    const deleteResponse = await support.client.send(
      new DeleteApiTokenCommand({ apiTokenId: tokenCreated.apiTokenId }),
    );
    expect(deleteResponse).to.be.null;
    const apiTokenDeleted = await getApiToken(tokenCreated.apiTokenId);
    expect(apiTokenDeleted).to.be.undefined;
    createdTokenId = null;
  });

  /**
   * @param {string} tokenId
   * @return {Promise<ApiToken>}
   */
  async function getApiToken(tokenId) {
    const listResponse = await support.client.send(new ListApiTokenCommand());
    return listResponse.find((t) => t.apiTokenId === tokenId);
  }
});
