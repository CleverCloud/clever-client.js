import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CreateProfileEmailAddressCommand } from '../../../../../src/clients/cc-api/commands/profile/create-profile-email-address-command.js';
import { DeleteProfileEmailAddressCommand } from '../../../../../src/clients/cc-api/commands/profile/delete-profile-email-address-command.js';
import { GetProfileCommand } from '../../../../../src/clients/cc-api/commands/profile/get-profile-command.js';
import { ListProfileEmailAddressCommand } from '../../../../../src/clients/cc-api/commands/profile/list-profile-email-address-command.js';
import { SetProfilePrimaryEmailAddressCommand } from '../../../../../src/clients/cc-api/commands/profile/set-profile-primary-email-address-command.js';
import { UpdateProfileAvatarCommand } from '../../../../../src/clients/cc-api/commands/profile/update-profile-avatar-command.js';
import { UpdateProfileCommand } from '../../../../../src/clients/cc-api/commands/profile/update-profile-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('profile commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should get profile linked', async () => {
    const response = await support.client.send(new GetProfileCommand());

    expect(response.id).toBe(support.userId);
    expect(response.isLinkedToGitHub).toBe(true);
  });

  it('should get profile when account is not linked to github', async () => {
    const response = await support.getClient({ user: 'test-user-without-github' }).send(new GetProfileCommand());

    expect(response.isLinkedToGitHub).toBe(false);
  });

  it('should update profile', async () => {
    const profile = await support.client.send(new GetProfileCommand());

    const response = await support.client.send(new UpdateProfileCommand({ name: 'updated name' }));

    try {
      expect(response.id).toBe(support.userId);
      expect(response.name).toBe('updated name');
    } finally {
      await support.client.send(new UpdateProfileCommand({ name: profile.name }));
    }
  });

  it('should update avatar with dataSource', async () => {
    let getImage: Response;
    try {
      getImage = await fetch('/avatar');
    } catch {
      getImage = await fetch('https://www.clever.cloud/app/themes/Starter/assets/img/brand-assets/square-png.png');
    }

    const response = await support.client.send(
      new UpdateProfileAvatarCommand({
        type: 'dataSource',
        mimeType: 'image/jpeg',
        data: await getImage.blob(),
      }),
    );

    try {
      expect(response.url).not.toBeNull();
      new URL(response.url);
    } finally {
      await support.client.send(
        new UpdateProfileAvatarCommand({
          type: 'externalSource',
          source: 'github',
        }),
      );
    }
  });

  it('should update avatar with github external source', async () => {
    const response = await support.client.send(
      new UpdateProfileAvatarCommand({
        type: 'externalSource',
        source: 'github',
      }),
    );

    expect(response.url).not.toBeNull();
    expect(response.url).toMatch(/^https:\/\/avatars\.githubusercontent\.com/);
  });

  it('should update avatar with gravatar external source', async () => {
    const response = await support.client.send(
      new UpdateProfileAvatarCommand({
        type: 'externalSource',
        source: 'gravatar',
      }),
    );

    expect(response.url).not.toBeNull();
    expect(response.url).toMatch(/^https:\/\/www.gravatar.com\/avatar/);
  });

  it('should list email addresses', async () => {
    const response = await support.client.send(new ListProfileEmailAddressCommand());

    expect(response.primaryAddress).not.toBeNull();
    expect(response.primaryAddress.address).toBeTypeOf('string');
    expect(response.primaryAddress.verified).toBe(true);
    expect(response.secondaryAddresses).not.toBeNull();
    expect(response.secondaryAddresses).toBeInstanceOf(Array);
  });

  // cannot be automatised because we need to check email
  it.skip('should create secondary email address', async () => {
    const response = await support.client.send(
      new CreateProfileEmailAddressCommand({
        address: 'frontend-ci+github-secondary@clever-cloud.com',
      }),
    );

    expect(response).toBeNull();
  });

  // cannot be automatised because we need to check email
  it.skip('should delete secondary email address', async () => {
    const response = await support.client.send(
      new DeleteProfileEmailAddressCommand({
        address: 'frontend-ci+github-secondary@clever-cloud.com',
      }),
    );

    expect(response).toBeNull();
  });

  // cannot be automatised because we need to check email
  it.skip('should set email address as primary', async () => {
    const response = await support.client.send(
      new SetProfilePrimaryEmailAddressCommand({
        address: 'frontend-ci+github@clever-cloud.com',
      }),
    );

    expect(response).toBeNull();
  });
});
