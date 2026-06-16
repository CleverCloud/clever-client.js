import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { CreateDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/create-domain-command.js';
import { DeleteDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/delete-domain-command.js';
import { GetPrimaryDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/get-primary-domain-command.js';
import { ListDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/list-domain-command.js';
import { SetPrimaryDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/set-primary-domain-command.js';
import { UnsetPrimaryDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/unset-primary-domain-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('domain commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    await support.deleteApplications();
  });

  it('should create domain', async () => {
    const application = await support.createTestApplication();

    const response = await support.client.send(
      new CreateDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );

    expect(response).toBeNull();
  });

  it('should delete domain', async () => {
    const application = await support.createTestApplication();
    await support.client.send(
      new CreateDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );

    const response = await support.client.send(
      new DeleteDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );

    expect(response).toBeNull();
  });

  it('should get primary domain', async () => {
    const application = await support.createTestApplication();
    await support.client.send(
      new CreateDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );
    await support.client.send(
      new SetPrimaryDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );

    const response = await support.client.send(
      new GetPrimaryDomainCommand({
        applicationId: application.id,
      }),
    );

    expect(response.isPrimary).toBe(true);
    expect(response.domain).toBe('foo.com/');
  });

  it('should list domains', async () => {
    const application = await support.createTestApplication();
    await support.client.send(
      new CreateDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );

    const response = await support.client.send(
      new ListDomainCommand({
        applicationId: application.id,
      }),
    );

    expect(response).toBeInstanceOf(Array);
    expect(response).toHaveLength(2);
    expect(response).toEqualInAnyOrder([
      {
        domain: `app-${application.id.replace('app_', '')}.cleverapps.io/`,
        isPrimary: false,
      },
      { domain: 'foo.com/', isPrimary: false },
    ]);
  });

  it('should set primary domain', async () => {
    const application = await support.createTestApplication();
    await support.client.send(
      new CreateDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );

    const response = await support.client.send(
      new SetPrimaryDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );

    expect(response).toBeNull();
  });

  it('should unset primary domain', async () => {
    const application = await support.createTestApplication();
    await support.client.send(
      new CreateDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );
    await support.client.send(
      new SetPrimaryDomainCommand({
        applicationId: application.id,
        domain: 'foo.com',
      }),
    );

    const response = await support.client.send(
      new UnsetPrimaryDomainCommand({
        applicationId: application.id,
      }),
    );

    expect(response).toBeNull();
  });
});
