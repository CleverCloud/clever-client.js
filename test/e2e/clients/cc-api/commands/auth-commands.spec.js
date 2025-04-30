import { expect } from 'chai';
import { TOTP } from 'totp-generator';
import { ConfirmAuthMfaCommand } from '../../../../../src/clients/cc-api/commands/auth/confirm-auth-mfa-command.js';
import { CreateAuthMfaCommand } from '../../../../../src/clients/cc-api/commands/auth/create-auth-mfa-command.js';
import { DeleteAuthMfaCommand } from '../../../../../src/clients/cc-api/commands/auth/delete-auth-mfa-command.js';
import { GetAuthMfaBackupCodesCommand } from '../../../../../src/clients/cc-api/commands/auth/get-auth-mfa-backup-codes-command.js';
import { UpdateAuthPasswordCommand } from '../../../../../src/clients/cc-api/commands/auth/update-auth-password-command.js';
import { GetProfileCommand } from '../../../../../src/clients/cc-api/commands/profile/get-profile-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('auth commands', function () {
  const support = e2eSupport({ auth: 'oauth-v1' });

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  afterEach(async () => {
    const profile = await support.client.send(new GetProfileCommand());

    if (profile.preferredMFA === 'TOTP') {
      await support.client.send(new DeleteAuthMfaCommand({ kind: 'TOTP', password: support.password }));
    }
  });

  it('should delete auth mfa', async () => {
    await createMfa();

    const response = await support.client.send(new DeleteAuthMfaCommand({ kind: 'TOTP', password: support.password }));
    expect(response).to.be.null;
  });

  it('should create auth mfa', async () => {
    const response = await support.client.send(new CreateAuthMfaCommand({ kind: 'TOTP', password: support.password }));

    const url = new URL(response.url);
    expect(url.protocol).to.equal('otpauth:');
    expect(url.host).to.equal('totp');
    expect(url.searchParams.get('issuer')).to.equal('Clever Cloud');
    expect(url.searchParams.get('algorithm')).to.equal('SHA1');
    expect(url.searchParams.get('secret')).to.be.a('string');
  });

  it('should confirm mfa', async () => {
    const response = await support.client.send(new CreateAuthMfaCommand({ kind: 'TOTP', password: support.password }));
    const mfaCode = TOTP.generate(new URL(response.url).searchParams.get('secret')).otp;

    // confirm MFA
    const confirmResponse = await support.client.send(
      new ConfirmAuthMfaCommand({
        kind: 'TOTP',
        code: mfaCode,
        password: support.password,
      }),
    );

    expect(confirmResponse).to.be.null;
  });

  it('should get mfa backup codes', async () => {
    await createMfa();

    const response = await support.client.send(
      new GetAuthMfaBackupCodesCommand({ kind: 'TOTP', password: support.password }),
    );

    expect(response).to.have.lengthOf(10);
  });

  it('should update password', async () => {
    const oldPassword = support.password;
    const newPassword = support.newTemporaryPassword;
    try {
      const response = await support.client.send(
        new UpdateAuthPasswordCommand({ oldPassword, newPassword, revokeTokens: false }),
      );

      expect(response).to.be.null;
    } finally {
      await support.client.send(
        new UpdateAuthPasswordCommand({ oldPassword: newPassword, newPassword: oldPassword, revokeTokens: false }),
      );
    }
  });

  async function createMfa() {
    // create MFA
    const response = await support.client.send(new CreateAuthMfaCommand({ kind: 'TOTP', password: support.password }));

    // generate OTP
    const mfaCode = TOTP.generate(new URL(response.url).searchParams.get('secret')).otp;

    // confirm MFA
    await support.client.send(
      new ConfirmAuthMfaCommand({
        kind: 'TOTP',
        code: mfaCode,
        password: support.password,
      }),
    );
  }
});
