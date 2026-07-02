import { pickNonNull } from '../../pick-non-null.js';

/**
 * GET /application/{appId}/environment
 */
export function todo_getEnv(params: { appId: string; token: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/application/${params.appId}/environment`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['token']),
    // no body
  });
}

/**
 * PUT /application/{appId}/environment
 */
export function todo_updateEnv(params: { appId: string; token: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/application/${params.appId}/environment`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    queryParams: pickNonNull(params, ['token']),
    body,
  });
}

/**
 * POST /authenticate
 */
export function todo_postAuthenticate(params: { owner: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/authenticate`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    queryParams: pickNonNull(params, ['owner']),
    body,
  });
}

/**
 * POST /authorize
 */
export function todo_postAuthorize(_params: object, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/authorize`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /newsfeeds/blog
 */
export function todo_getBlogFeed() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/newsfeeds/blog`,
    headers: { Accept: '*/*' },
    // no query params
    // no body
  });
}

/**
 * GET /newsfeeds/engineering
 */
export function todo_getEngineeringFeed() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/newsfeeds/engineering`,
    headers: { Accept: '*/*' },
    // no query params
    // no body
  });
}

/**
 * POST /oauth/access_token_query
 */
export function todo_postAccessTokenRequestQuery(params: {
  oauth_consumer_key: string;
  oauth_token: string;
  oauth_signature_method: string;
  oauth_signature: string;
  oauth_timestamp: string;
  oauth_nonce: string;
  oauth_version: string;
  oauth_verifier: string;
  oauth_callback: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/oauth/access_token_query`,
    headers: { Accept: 'application/x-www-form-urlencoded' },
    queryParams: pickNonNull(params, [
      'oauth_consumer_key',
      'oauth_token',
      'oauth_signature_method',
      'oauth_signature',
      'oauth_timestamp',
      'oauth_nonce',
      'oauth_version',
      'oauth_verifier',
      'oauth_callback',
      'oauth_token_secret',
      'oauth_callback_confirmed',
    ]),
    // no body
  });
}

/**
 * GET /oauth/authorize
 */
export function todo_authorizeForm(params: {
  ccid: string;
  cctk: string;
  oauth_token: string;
  cli_token: string;
  from_oauth: string;
  partner_id: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/oauth/authorize`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['oauth_token', 'ccid', 'cli_token', 'from_oauth', 'partner_id']),
    // no body
  });
}

/**
 * POST /oauth/authorize
 */
export function todo_authorizeToken(_params: { ccid: string; cctk: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/oauth/authorize`,
    headers: { Accept: 'text/html, application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * POST /oauth/request_token_query
 */
export function todo_postReqTokenRequestQueryString(params: {
  partner_id: string;
  oauth_consumer_key: string;
  oauth_token: string;
  oauth_signature_method: string;
  oauth_signature: string;
  oauth_timestamp: string;
  oauth_nonce: string;
  oauth_version: string;
  oauth_verifier: string;
  oauth_callback: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/oauth/request_token_query`,
    headers: { Accept: 'application/x-www-form-urlencoded' },
    queryParams: pickNonNull(params, [
      'partner_id',
      'oauth_consumer_key',
      'oauth_token',
      'oauth_signature_method',
      'oauth_signature',
      'oauth_timestamp',
      'oauth_nonce',
      'oauth_version',
      'oauth_verifier',
      'oauth_callback',
      'oauth_token_secret',
      'oauth_callback_confirmed',
    ]),
    // no body
  });
}

/**
 * GET /oauth/rights
 */
export function todo_getAvailableRights() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/oauth/rights`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /oidc/{service}/callback
 */
export function todo_oidcCallback(params: {
  service: string;
  CcOAuthData: string;
  code: string;
  state: string;
  error: string;
  error_description: string;
  error_uri: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/oidc/${params.service}/callback`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['code', 'state', 'error', 'error_description', 'error_uri']),
    // no body
  });
}

/**
 * GET /oidc/{service}/login
 */
export function todo_getOIDCLogin(params: {
  service: string;
  redirectUrl: string;
  fromAuthorize: string;
  cli_token: string;
  partner_id: string;
  oauth_token: string;
  invitationKey: string;
  subscriptionSource: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/oidc/${params.service}/login`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, [
      'redirectUrl',
      'fromAuthorize',
      'cli_token',
      'partner_id',
      'oauth_token',
      'invitationKey',
      'subscriptionSource',
    ]),
    // no body
  });
}

/**
 * GET /oidc/{service}/signup
 */
export function todo_oidcSignup(params: {
  service: string;
  redirectUrl: string;
  fromAuthorize: string;
  cli_token: string;
  oauth_token: string;
  invitationKey: string;
  subscriptionSource: string;
  terms: string;
  partnerId: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/oidc/${params.service}/signup`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, [
      'redirectUrl',
      'fromAuthorize',
      'cli_token',
      'oauth_token',
      'invitationKey',
      'subscriptionSource',
      'terms',
      'partnerId',
    ]),
    // no body
  });
}

/**
 * POST /oidc/{service}/signup
 */
export function todo_oidcSignupEnd(params: { service: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/oidc/${params.service}/signup`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * GET /password_forgotten
 */
export function todo_getPasswordForgottenForm(params: { partner_id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/password_forgotten`,
    headers: { Accept: 'text/html' },
    queryParams: pickNonNull(params, ['partner_id']),
    // no body
  });
}

/**
 * POST /password_forgotten
 */
export function todo_askForPasswordResetViaForm(_params: object, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/password_forgotten`,
    headers: { Accept: 'text/html', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * GET /password_forgotten/{key}
 */
export function todo_confirmPasswordResetRequest(params: { key: string; partner_id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/password_forgotten/${params.key}`,
    headers: { Accept: 'text/html' },
    queryParams: pickNonNull(params, ['partner_id']),
    // no body
  });
}

/**
 * POST /password_forgotten/{key}
 */
export function todo_resetPasswordForgotten(params: { key: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/password_forgotten/${params.key}`,
    headers: { Accept: 'text/html', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * GET /payments/assets/pay_button/{token}/button.png
 */
export function todo_getInvoiceStatusButton(params: { token: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/payments/assets/pay_button/${params.token}/button.png`,
    headers: { Accept: 'image/png' },
    // no query params
    // no body
  });
}

/**
 * GET /payments/coupons/{name}
 */
export function todo_getCoupon(params: { name: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/payments/coupons/${params.name}`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /payments/providers
 */
export function todo_getAvailablePaymentProviders() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/payments/providers`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * GET /payments/tokens/stripe
 */
export function todo_getStripeToken() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/payments/tokens/stripe`,
    headers: {},
    // no query params
    // no body
  });
}

/**
 * POST /payments/webhooks/stripe/sepa
 */
export function todo_stripeSepaWebhook(_params: { 'Stripe-Signature': string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/payments/webhooks/stripe/sepa`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * POST /payments/{bid}/end/stripe
 */
export function todo_endPaymentWithStripe(params: { bid: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/payments/${params.bid}/end/stripe`,
    headers: { 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * PUT /payments/{bid}/end/stripe
 */
export function todo_updateStripePayment(params: { bid: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/payments/${params.bid}/end/stripe`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /products/addonproviders/{provider_id}/informations
 */
export function todo_getAddonProviderInfos(params: { provider_id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/addonproviders/${params.provider_id}/informations`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /products/addonproviders/{provider_id}/versions
 */
export function todo_getAddonProviderVersions(params: { provider_id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/addonproviders/${params.provider_id}/versions`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /products/countries
 */
export function todo_getCountries() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/countries`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /products/countrycodes
 */
export function todo_getCountryCodes() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/countrycodes`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /products/flavors
 */
export function todo_getFlavors(params: { context: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/flavors`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['context']),
    // no body
  });
}

/**
 * GET /products/instances/{type}-{version}
 */
export function todo_getInstance(params: { type: string; version: string; for: string; app: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/instances/${params.type}-${params.version}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['for', 'app']),
    // no body
  });
}

/**
 * GET /products/mfa_kinds
 */
export function todo_getMFAKinds() {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/mfa_kinds`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /products/packages
 */
export function todo_getAvailablePackages(params: { coupon: string; orgaId: string; currency: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/products/packages`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['coupon', 'orgaId', 'currency']),
    // no body
  });
}

/**
 * GET /session/from/{subscription_source}/signup
 */
export function todo_getSignupFormForSource(params: {
  invitationKey: string;
  url_next: string;
  subscription_source: string;
  partner_id: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/session/from/${params.subscription_source}/signup`,
    headers: { Accept: 'text/html' },
    queryParams: pickNonNull(params, ['invitationKey', 'url_next', 'partner_id']),
    // no body
  });
}

/**
 * GET /session/login
 */
export function todo_getLoginForm(params: {
  secondaryEmailKey: string;
  deletionKey: string;
  fromAuthorize: string;
  cli_token: string;
  partner_id: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/session/login`,
    headers: { Accept: 'text/html' },
    queryParams: pickNonNull(params, ['secondaryEmailKey', 'deletionKey', 'fromAuthorize', 'cli_token', 'partner_id']),
    // no body
  });
}

/**
 * POST /session/login
 */
export function todo_login(_params: object, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/session/login`,
    headers: { Accept: 'text/html', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * POST /session/mfa_login
 */
export function todo_mfaLogin(_params: object, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/session/mfa_login`,
    headers: { Accept: 'text/html', 'Content-Type': 'application/x-www-form-urlencoded' },
    // no query params
    body,
  });
}

/**
 * GET /session/signup
 */
export function todo_getSignupForm(params: {
  invitationKey: string;
  url_next: string;
  subscription_source: string;
  partner_id: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/session/signup`,
    headers: { Accept: 'text/html' },
    queryParams: pickNonNull(params, ['invitationKey', 'url_next', 'subscription_source', 'partner_id']),
    // no body
  });
}

/**
 * GET /sessions/from/{subscription_source}/signup
 */
export function todo_getSignupFormForSource_1(params: {
  subscription_source: string;
  invitationKey: string;
  url_next: string;
  partner_id: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/sessions/from/${params.subscription_source}/signup`,
    headers: { Accept: 'text/html' },
    queryParams: pickNonNull(params, ['invitationKey', 'url_next', 'partner_id']),
    // no body
  });
}

/**
 * GET /sessions/login
 */
export function todo_getLoginForm_1(params: {
  secondaryEmailKey: string;
  deletionKey: string;
  fromAuthorize: string;
  cli_token: string;
  partner_id: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/sessions/login`,
    headers: { Accept: 'text/html' },
    queryParams: pickNonNull(params, ['secondaryEmailKey', 'deletionKey', 'fromAuthorize', 'cli_token', 'partner_id']),
    // no body
  });
}

/**
 * GET /sessions/signup
 */
export function todo_getSignupForm_1(params: {
  invitationKey: string;
  url_next: string;
  subscription_source: string;
  partner_id: string;
}) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/sessions/signup`,
    headers: { Accept: 'text/html' },
    queryParams: pickNonNull(params, ['invitationKey', 'url_next', 'subscription_source', 'partner_id']),
    // no body
  });
}

/**
 * GET /users/{id}
 */
export function todo_getUser(params: { id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/users/${params.id}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /users/{id}/applications
 */
export function todo_listUserApplications(params: { id: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/users/${params.id}/applications`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /users/{userId}/git-info
 */
export function todo_getUserGitInformations(params: { userId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/users/${params.userId}/git-info`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * GET /vat_check
 */
export function todo_checkVat(params: { country: string; vat: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/vat_check`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['country', 'vat']),
    // no body
  });
}

/**
 * POST /vendor/addons
 */
export function todo_provisionOtherAddon(_params: object, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/vendor/addons`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /vendor/apps
 */
export function todo_listApps(params: { offset: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/vendor/apps`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['offset']),
    // no body
  });
}

/**
 * GET /vendor/apps/{addonId}
 */
export function todo_getApplicationInfo(params: { addonId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/vendor/apps/${params.addonId}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /vendor/apps/{addonId}
 */
export function todo_editApplicationConfiguration(params: { addonId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/vendor/apps/${params.addonId}`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * POST /vendor/apps/{addonId}/consumptions
 */
export function todo_billOwner(params: { addonId: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/vendor/apps/${params.addonId}/consumptions`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    // no query params
    body,
  });
}

/**
 * GET /vendor/apps/{addonId}/logscollector
 */
export function todo_logscollector(params: { addonId: string }) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/vendor/apps/${params.addonId}/logscollector`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /vendor/apps/{addonId}/migration_callback
 */
export function todo_endAddonMigration(params: { addonId: string; plan_id: string; region: string }, body: object) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/vendor/apps/${params.addonId}/migration_callback`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    queryParams: pickNonNull(params, ['plan_id', 'region']),
    body,
  });
}
