import { expect } from 'chai';
import { TOTP } from 'totp-generator';
import { ConfirmAuthMfaCommand } from '../../../../../src/clients/cc-api/commands/auth/confirm-auth-mfa-command.js';
import { CreateAuthMfaCommand } from '../../../../../src/clients/cc-api/commands/auth/create-auth-mfa-command.js';
import { DeleteAuthMfaCommand } from '../../../../../src/clients/cc-api/commands/auth/delete-auth-mfa-command.js';
import { GetAuthMfaBackupCodesCommand } from '../../../../../src/clients/cc-api/commands/auth/get-auth-mfa-backup-codes-command.js';
import { UpdateAuthPasswordCommand } from '../../../../../src/clients/cc-api/commands/auth/update-auth-password-command.js';
import { e2eSupport } from '../../../../lib/e2e-support.js';

// cannot be automatised
// requires env with something like:
//
// ONE_PASSWORD_USER_ID="lazpz3voaxr5mmxeve45mjwlx4"
// export CC_USER_PASSWORD="$(op item get $ONE_PASSWORD_USER_ID --fields password --reveal)"
// export CC_USER_TOTP="$(op item get $ONE_PASSWORD_USER_ID --otp)"
describe.skip('auth commands', function () {
  this.timeout(10000);

  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should delete auth mfa', async () => {
    const response = await support.client.send(
      new DeleteAuthMfaCommand({
        kind: 'TOTP',
        password: globalThis.process?.env.CC_USER_PASSWORD,
      }),
    );

    expect(response).to.be.null;
  });

  it('should create auth mfa', async () => {
    // create MFA
    const response = await support.client.send(
      new CreateAuthMfaCommand({
        kind: 'TOTP',
        password: globalThis.process?.env.CC_USER_PASSWORD,
      }),
    );

    const url = new URL(response.url);
    expect(url.protocol).to.equal('otpauth:');
    expect(url.host).to.equal('totp');
    expect(url.searchParams.get('issuer')).to.equal('Clever Cloud');
    expect(url.searchParams.get('algorithm')).to.equal('SHA1');
    expect(url.searchParams.get('secret')).to.be.a('string');

    // generate OTP
    const { otp } = TOTP.generate(url.searchParams.get('secret'));

    // confirm MFA
    const confirmResponse = await support.client.send(
      new ConfirmAuthMfaCommand({
        kind: 'TOTP',
        code: otp,
        password: globalThis.process?.env.CC_USER_PASSWORD,
      }),
    );

    expect(confirmResponse).to.be.null;

    // we log TOTP URL so that we have the totp link
    console.log(url);
  });

  it('should get mfa backup codes', async () => {
    const response = await support.client.send(
      new GetAuthMfaBackupCodesCommand({
        kind: 'TOTP',
        password: globalThis.process?.env.CC_USER_PASSWORD,
      }),
    );

    expect(response).to.have.lengthOf(10);
  });

  it('should update password', async () => {
    const response = await support.client.send(
      new UpdateAuthPasswordCommand({
        oldPassword: globalThis.process?.env.CC_USER_PASSWORD,
        newPassword: '...',
      }),
    );

    expect(response).to.be.null;
  });
});
