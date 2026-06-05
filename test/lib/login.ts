import * as cheerio from 'cheerio';
import cookie from 'cookie';
import timers from 'node:timers/promises';
import { TOTP } from 'totp-generator';
import { CcApiBridgeClient } from '../../src/clients/cc-api-bridge/cc-api-bridge-client.js';
import { CreateApiTokenCommand } from '../../src/clients/cc-api-bridge/commands/api-token/create-api-token-command.js';
import { DeleteApiTokenCommand } from '../../src/clients/cc-api-bridge/commands/api-token/delete-api-token-command.js';
import { CcApiClient } from '../../src/clients/cc-api/cc-api-client.js';
import { DeleteOauthTokenCommand } from '../../src/clients/cc-api/commands/oauth-token/delete-oauth-token-command.js';
import { getAllE2eUsers } from './e2e-test-users.js';

import type { E2eUser } from './e2e.types.js';

const OAUTH_CONSUMER_KEY = globalThis.process?.env.OAUTH_CONSUMER_KEY;
const OAUTH_CONSUMER_SECRET = globalThis.process?.env.OAUTH_CONSUMER_SECRET;

export async function login(): Promise<void> {
  console.log('log in all users');
  await Promise.all(getAllE2eUsers().map(loginUser));
  console.log('all users logged in');
}

export async function logout(): Promise<void> {
  console.log('log out all users');
  await Promise.all(getAllE2eUsers().map(logoutUser));
  console.log('all users logged out');
}

async function loginUser(user: E2eUser): Promise<void> {
  console.log(`  login attempt for user ${user.userName} (${user.email})`);
  const oauthDance = new OauthDance({
    API_HOST: 'https://api.clever-cloud.com',
    OAUTH_CONSUMER_KEY: OAUTH_CONSUMER_KEY!,
    OAUTH_CONSUMER_SECRET: OAUTH_CONSUMER_SECRET!,
    OAUTH_CONSUMER_CALLBACK_URL: 'https://console.clever-cloud.com',
  });

  await oauthDance.postOauthRequestToken();
  let mfaCode: string | undefined;
  const requiresMfa = await oauthDance.postSessionsLogin(user.email, user.password);
  if (requiresMfa) {
    mfaCode = (await TOTP.generate(user.totpSecret!)).otp;
    await oauthDance.postSessionsMfaLogin(mfaCode);
  }
  await timers.setTimeout(1000);
  const requiresOauthRights = await oauthDance.getOauthAuthorize();
  if (requiresOauthRights) {
    await oauthDance.postOauthAuthorize();
  }
  await timers.setTimeout(1000);
  const { oauthUserToken, oauthUserSecret } = await oauthDance.postOauthAccessToken();
  user.oauthTokens = {
    consumerKey: OAUTH_CONSUMER_KEY!,
    consumerSecret: OAUTH_CONSUMER_SECRET!,
    token: oauthUserToken,
    secret: oauthUserSecret,
  };
  console.log(`  login success for user ${user.userName} (${user.email})`);

  const client = new CcApiBridgeClient({ oauthTokens: user.oauthTokens });
  const { apiTokenId, apiToken } = await client.send(
    new CreateApiTokenCommand({
      email: user.email,
      password: user.password,
      mfaCode: mfaCode,
      description: 'Temporary tokens for clever-client.js E2E tests',
      name: 'client.js E2E tests',
      expirationDate: new Date(Date.now() + 1000 * 60 * 30),
    }),
  );
  user.apiToken = apiToken;
  user.apiTokenId = apiTokenId;
  console.log(`  api token creation success for user ${user.userName} (${user.email})`);
}

async function logoutUser(user: E2eUser): Promise<void> {
  if (user.apiTokenId != null && user.oauthTokens != null) {
    const apiBridgeClient = new CcApiBridgeClient({ oauthTokens: user.oauthTokens });
    await apiBridgeClient.send(new DeleteApiTokenCommand({ apiTokenId: user.apiTokenId }));
    console.log(`  api token deletion success for user ${user.email}`);
  }

  if (user.oauthTokens != null) {
    const client = new CcApiClient({ authMethod: { type: 'oauth-v1', oauthTokens: user.oauthTokens } });
    await client.send(new DeleteOauthTokenCommand({ token: user.oauthTokens.token }));
    console.log(`  logout success for user ${user.email}`);
  }
}

/**
 * This class could have a more robust and secure implementation,
 * but we preferred a simpler approach for maintainability and readability.
 * This means that the order of the calls must be carefully followed:
 *
 * 1) postOauthRequestToken()
 * 2) postSessionsLogin()
 * 2bis) postSessionsMfaLogin (if necessary after postSessionsLogin())
 * 3) getOauthAuthorize()
 * 3bis) postOauthAuthorize (if necessary after getOauthAuthorize())
 * 4) postOauthAccessToken()
 */
class OauthDance {
  #API_HOST: string;
  #OAUTH_CONSUMER_KEY: string;
  #OAUTH_CONSUMER_SECRET: string;
  #OAUTH_CONSUMER_CALLBACK_URL: string;

  constructor({
    API_HOST,
    OAUTH_CONSUMER_KEY,
    OAUTH_CONSUMER_SECRET,
    OAUTH_CONSUMER_CALLBACK_URL,
  }: {
    /** The API host URL */
    API_HOST: string;
    /** OAuth consumer key */
    OAUTH_CONSUMER_KEY: string;
    /** OAuth consumer secret */
    OAUTH_CONSUMER_SECRET: string;
    /** OAuth callback URL */
    OAUTH_CONSUMER_CALLBACK_URL: string;
  }) {
    this.#API_HOST = API_HOST;
    this.#OAUTH_CONSUMER_KEY = OAUTH_CONSUMER_KEY;
    this.#OAUTH_CONSUMER_SECRET = OAUTH_CONSUMER_SECRET;
    this.#OAUTH_CONSUMER_CALLBACK_URL = OAUTH_CONSUMER_CALLBACK_URL;
  }

  //#region [1] get request token

  #oauthToken!: string | null;
  #oauthTokenSecret!: string | null;

  /**
   * @throws {OauthDanceError}
   */
  async postOauthRequestToken(): Promise<void> {
    const response = await this.#postForm('/v2/oauth/request_token', {
      oauth_consumer_key: this.#OAUTH_CONSUMER_KEY,
      oauth_signature: this.#OAUTH_CONSUMER_SECRET + '&',
      oauth_callback: this.#OAUTH_CONSUMER_CALLBACK_URL,
    });

    if (!response.ok) {
      const responseBody = await response.text();
      throw new OauthDanceError('1', `POST /v2/oauth/request_token: ${response.status}`, responseBody);
    }

    const encodedSearchParams = await response.text();
    const searchParams = new URLSearchParams(encodedSearchParams);

    this.#oauthToken = searchParams.get('oauth_token');
    this.#oauthTokenSecret = searchParams.get('oauth_token_secret');
  }

  //#endregion

  //#region [2] submit login form / submit MFA form

  #email!: string | null;
  #mfaFormHtml!: string | null;
  #ccid!: string | null;

  /**
   * @param email - User email
   * @param password - User password
   * @returns Returns true if MFA is required
   * @throws {InvalidCredentialError | OauthDanceError}
   */
  async postSessionsLogin(email: string, password: string): Promise<boolean> {
    const response = await this.#postForm('/v2/sessions/login', {
      email,
      pass: password,
      from_authorize: 'true',
    });

    if (response.status === 401) {
      throw new InvalidCredentialError();
    }

    if (response.status === 200) {
      this.#email = email;
      this.#mfaFormHtml = await response.text();
      return true;
    }

    if (response.status === 303) {
      const cookies = cookie.parse(response.headers.get('set-cookie') || '');
      this.#ccid = cookies.ccid ?? null;
      return false;
    }

    const responseBody = await response.text();
    throw new OauthDanceError('2', `POST /v2/sessions/login: ${response.status}`, responseBody);
  }

  /**
   * @param mfaCode - Multi-factor authentication code
   * @throws {InvalidMfaCodeError | OauthDanceError}
   */
  async postSessionsMfaLogin(mfaCode: string): Promise<void> {
    const $ = cheerio.load(this.#mfaFormHtml || '');

    const form = $('form[action="/v2/sessions/mfa_login"]');
    if (form.length !== 1) {
      throw new OauthDanceError('2bis', `MFA page does not have the expected HTML form`);
    }
    const mfaAuthId = $(form).find('input[type="hidden"][name="auth_id"]').attr('value');

    const response = await this.#postForm('/v2/sessions/mfa_login', {
      mfa_attempt: mfaCode,
      mfa_kind: 'TOTP',
      auth_id: mfaAuthId!,
      email: this.#email!,
    });

    if (response.status === 401) {
      throw new InvalidMfaCodeError();
    }

    if (response.status === 303) {
      const cookies = cookie.parse(response.headers.get('set-cookie') || '');
      this.#ccid = cookies.ccid ?? null;
      return;
    }

    const responseBody = await response.text();
    throw new OauthDanceError('2bis', `POST /v2/sessions/mfa_login): ${response.status}`, responseBody);
  }

  //#endregion

  //#region [3] authorize / submit oauth rights form

  #oauthRightsHtml!: string | null;
  #oauthVerifier!: string | null;
  #userId!: string | null;

  /**
   * @returns Returns true if rights form needs to be submitted
   * @throws {OauthDanceError}
   */
  async getOauthAuthorize(): Promise<boolean> {
    const response = await fetch(`${this.#API_HOST}/v2/oauth/authorize`, {
      redirect: 'manual',
      credentials: 'include',
      headers: {
        cookie: serializeCookies({
          cctk: this.#oauthToken!,
          ccid: this.#ccid!,
        }),
      },
    });

    if (response.status === 200) {
      this.#oauthRightsHtml = await response.text();
      return true;
    }

    if (response.status === 303) {
      const locationUrl = new URL(response.headers.get('location') || '');
      this.#oauthVerifier = locationUrl.searchParams.get('oauth_verifier');
      this.#userId = locationUrl.searchParams.get('user');
      return false;
    }

    const responseBody = await response.text();
    throw new OauthDanceError('3', `GET /v2/oauth/authorize): ${response.status}`, responseBody);
  }

  /**
   * @throws {OauthDanceError}
   */
  async postOauthAuthorize(): Promise<void> {
    const $ = cheerio.load(this.#oauthRightsHtml || '');

    const form = $('form[action="/v2/oauth/authorize"]');
    if (form.length !== 1) {
      throw new OauthDanceError('3bis', `OAuth rights page does not have the expected HTML form`);
    }

    const oauthRights: Record<string, string> = $(form)
      .find('input[type="checkbox"]')
      .toArray()
      .reduce((acc: Record<string, string>, input) => {
        const name = $(input).attr('name');
        if (name) {
          acc[name] = 'on';
        }
        return acc;
      }, {});

    if (Object.entries(oauthRights).length === 0) {
      throw new OauthDanceError('3bis', `OAuth rights page does not have the expected HTML checkboxes`);
    }

    const response = await this.#postForm('/v2/oauth/authorize', oauthRights, {
      cctk: this.#oauthToken!,
      ccid: this.#ccid!,
    });

    if (response.status === 303) {
      const locationUrl = new URL(response.headers.get('location') || '');
      this.#oauthVerifier = locationUrl.searchParams.get('oauth_verifier');
      this.#userId = locationUrl.searchParams.get('user');
      return;
    }

    const responseBody = await response.text();
    throw new OauthDanceError('3bis', `POST /v2/oauth/authorize): ${response.status}`, responseBody);
  }

  //#endregion

  //#region [4] get access token

  oauthUserToken!: string | null;
  oauthUserSecret!: string | null;

  /**
   * @throws {OauthDanceError}
   */
  async postOauthAccessToken(): Promise<{ userId: string; oauthUserToken: string; oauthUserSecret: string }> {
    const response = await this.#postForm('/v2/oauth/access_token', {
      oauth_consumer_key: this.#OAUTH_CONSUMER_KEY,
      oauth_signature: this.#OAUTH_CONSUMER_SECRET + '&' + this.#oauthTokenSecret,
      oauth_token: this.#oauthToken!,
      oauth_verifier: this.#oauthVerifier!,
    });

    if (response.status === 200) {
      const encodedSearchParams = await response.text();
      const searchParams = new URLSearchParams(encodedSearchParams);
      return {
        userId: this.#userId!,
        oauthUserToken: searchParams.get('oauth_token')!,
        oauthUserSecret: searchParams.get('oauth_token_secret')!,
      };
    }

    const responseBody = await response.text();
    throw new OauthDanceError('4', `POST /v2/oauth/access_token): ${response.status}`, responseBody);
  }

  //#endregion

  /**
   * @param path - API endpoint path
   * @param data - Form data
   * @param cookies - Optional cookies to include
   */
  #postForm(path: string, data: Record<string, string>, cookies?: Record<string, string>): Promise<Response> {
    const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };

    if (cookies != null) {
      headers.cookie = serializeCookies(cookies);
    }

    const body = new URLSearchParams(data).toString();

    return fetch(`${this.#API_HOST}${path}`, {
      method: 'POST',
      headers,
      redirect: 'manual',
      credentials: 'include',
      body,
    });
  }
}

/**
 * Serialize cookies object into cookie header string
 */
function serializeCookies(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([name, value]) => cookie.serialize(name, value))
    .join(';');
}

class AuthBackendError extends Error {
  code: string;
  statusCode: number;
  details?: string;

  /**
   * @param message - The error message
   * @param code - The error code
   * @param statusCode - HTTP status code
   * @param details - Additional error details
   * @param cause - The cause of the error
   */
  constructor(message: string, code: string, statusCode: number, details?: string, cause?: Error) {
    super(message, { cause });
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

class InvalidCredentialError extends AuthBackendError {
  constructor() {
    super('Invalid credential', 'invalid-credential', 401);
  }
}

export class InvalidMfaCodeError extends AuthBackendError {
  constructor() {
    super('Invalid MFA code', 'invalid-mfa-code', 401);
  }
}

class OauthDanceError extends AuthBackendError {
  /**
   * @param step - The OAuth step that failed
   * @param details - Details about the failure
   * @param body - The response body of the API error
   */
  constructor(step: string, details: string, body: string = '') {
    super(
      'Token creation failed',
      `failed-token-creation-${step}`,
      500,
      `OAuth dance error [${step}] ${details} ${body}`,
    );
  }
}
