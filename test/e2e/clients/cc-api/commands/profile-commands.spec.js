import { expect } from 'chai';
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

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should get profile linked', async () => {
    const response = await support.client.send(new GetProfileCommand());

    expect(response.id).to.equal(support.userId);
    expect(response.isLinkedToGitHub).to.equal(true);
  });

  it('should get profile when account is not linked to github', async () => {
    const response = await support.getClient({ user: 'test-user-without-github' }).send(new GetProfileCommand());

    expect(response.isLinkedToGitHub).to.equal(false);
  });

  it('should update profile', async () => {
    const profile = await support.client.send(new GetProfileCommand());

    const response = await support.client.send(new UpdateProfileCommand({ name: 'updated name' }));

    try {
      expect(response.id).to.equal(support.userId);
      expect(response.name).to.equal('updated name');
    } finally {
      await support.client.send(new UpdateProfileCommand({ name: profile.name }));
    }
  });

  it('should update avatar with dataSource', async () => {
    let getImage;
    try {
      getImage = await fetch('/avatar');
    } catch (_e) {
      getImage = await fetch('https://www.clever-cloud.com/app/themes/Starter/assets/img/brand-assets/square-png.png');
    }

    const response = await support.client.send(
      new UpdateProfileAvatarCommand({
        type: 'dataSource',
        mimeType: 'image/jpeg',
        data: await getImage.blob(),
      }),
    );

    try {
      expect(response.url).not.to.be.null;
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

    expect(response.url).not.to.be.null;
    expect(response.url).to.match(/^https:\/\/avatars\.githubusercontent\.com/);
  });

  it('should update avatar with gravatar external source', async () => {
    const response = await support.client.send(
      new UpdateProfileAvatarCommand({
        type: 'externalSource',
        source: 'gravatar',
      }),
    );

    expect(response.url).not.to.be.null;
    expect(response.url).to.match(/^https:\/\/www.gravatar.com\/avatar/);
  });

  it('should list email addresses', async () => {
    const response = await support.client.send(new ListProfileEmailAddressCommand());

    expect(response.primaryAddress).not.to.be.null;
    expect(response.primaryAddress.address).to.be.a('string');
    expect(response.primaryAddress.verified).to.equal(true);
    expect(response.secondaryAddresses).not.to.be.null;
    expect(response.secondaryAddresses).to.be.an('array');
  });

  // cannot be automatised because we need to check email
  it.skip('should create secondary email address', async () => {
    const response = await support.client.send(
      new CreateProfileEmailAddressCommand({
        address: 'frontend-ci+github-secondary@clever-cloud.com',
      }),
    );

    expect(response).to.be.null;
  });

  // cannot be automatised because we need to check email
  it.skip('should delete secondary email address', async () => {
    const response = await support.client.send(
      new DeleteProfileEmailAddressCommand({
        address: 'frontend-ci+github-secondary@clever-cloud.com',
      }),
    );

    expect(response).to.be.null;
  });

  // cannot be automatised because we need to check email
  it.skip('should set email address as primary', async () => {
    const response = await support.client.send(
      new SetProfilePrimaryEmailAddressCommand({
        address: 'frontend-ci+github@clever-cloud.com',
      }),
    );

    expect(response).to.be.null;
  });
});
