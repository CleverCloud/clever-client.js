import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { CreateDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/create-domain-command.ts';
import { DeleteDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/delete-domain-command.ts';
import { GetPrimaryDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/get-primary-domain-command.ts';
import { ListDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/list-domain-command.ts';
import { SetPrimaryDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/set-primary-domain-command.ts';
import { UnsetPrimaryDomainCommand } from '../../../../../src/clients/cc-api/commands/domain/unset-primary-domain-command.ts';
import { e2eSupport } from '../e2e-support.ts';

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

    expect(response).toBeUndefined();
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

    expect(response).toBeUndefined();
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

  it('should list domains with primary', async () => {
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
      { domain: 'foo.com/', isPrimary: true },
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

    expect(response).toBeUndefined();
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

    expect(response).toBeUndefined();
  });
});
