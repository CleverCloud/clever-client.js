import { pickNonNull } from '../../pick-non-null.js';

/**
 * @typedef {import('../../request.types.js').RequestParams} RequestParams
 */

/**
 * GET /application/{appId}/environment
 * @param {Object} params
 * @param {String} params.appId
 * @param {String} params.token
 * @returns {Promise<RequestParams>}
 */
export function todo_getEnv(params) {
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
 * @param {Object} params
 * @param {String} params.appId
 * @param {String} params.token
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_updateEnv(params, body) {
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
 * @param {Object} params
 * @param {String} params.owner
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_postAuthenticate(params, body) {
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
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_postAuthorize(params, body) {
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
 * DELETE /invoice/external/paypal/{bid}
 * @param {Object} params
 * @param {String} params.bid
 * @returns {Promise<RequestParams>}
 */
export function todo_cancelPaypalTransaction(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'delete',
    url: `/v2/invoice/external/paypal/${params.bid}`,
    headers: { Accept: 'application/json' },
    // no query params
    // no body
  });
}

/**
 * PUT /invoice/external/paypal/{bid}
 * @param {Object} params
 * @param {String} params.bid
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_authorizePaypalTransaction(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/invoice/external/paypal/${params.bid}`,
    headers: { Accept: 'application/json', 'Content-Type': '*/*' },
    // no query params
    body,
  });
}

/**
 * POST /invoice/external/{bid}
 * @param {Object} params
 * @param {String} params.bid
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_updateInvoice(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'post',
    url: `/v2/invoice/external/${params.bid}`,
    headers: { Accept: 'application/json', 'Content-Type': '*/*' },
    // no query params
    body,
  });
}

/**
 * GET /newsfeeds/blog
 * @returns {Promise<RequestParams>}
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
 * @returns {Promise<RequestParams>}
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
 * @param {Object} params
 * @param {String} params.oauth_consumer_key
 * @param {String} params.oauth_token
 * @param {String} params.oauth_signature_method
 * @param {String} params.oauth_signature
 * @param {String} params.oauth_timestamp
 * @param {String} params.oauth_nonce
 * @param {String} params.oauth_version
 * @param {String} params.oauth_verifier
 * @param {String} params.oauth_callback
 * @param {String} params.oauth_token_secret
 * @param {String} params.oauth_callback_confirmed
 * @returns {Promise<RequestParams>}
 */
export function todo_postAccessTokenRequestQuery(params) {
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
 * @param {Object} params
 * @param {String} params.ccid
 * @param {String} params.cctk
 * @param {String} params.oauth_token
 * @param {String} params.ccid
 * @param {String} params.cli_token
 * @param {String} params.from_oauth
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_authorizeForm(params) {
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
 * @param {Object} params
 * @param {String} params.ccid
 * @param {String} params.cctk
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_authorizeToken(params, body) {
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
 * @param {Object} params
 * @param {String} params.partner_id
 * @param {String} params.oauth_consumer_key
 * @param {String} params.oauth_token
 * @param {String} params.oauth_signature_method
 * @param {String} params.oauth_signature
 * @param {String} params.oauth_timestamp
 * @param {String} params.oauth_nonce
 * @param {String} params.oauth_version
 * @param {String} params.oauth_verifier
 * @param {String} params.oauth_callback
 * @param {String} params.oauth_token_secret
 * @param {String} params.oauth_callback_confirmed
 * @returns {Promise<RequestParams>}
 */
export function todo_postReqTokenRequestQueryString(params) {
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
 * @returns {Promise<RequestParams>}
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
 * @param {Object} params
 * @param {String} params.service
 * @param {String} params.CcOAuthData
 * @param {String} params.code
 * @param {String} params.state
 * @param {String} params.error
 * @param {String} params.error_description
 * @param {String} params.error_uri
 * @returns {Promise<RequestParams>}
 */
export function todo_oidcCallback(params) {
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
 * @param {Object} params
 * @param {String} params.service
 * @param {String} params.redirectUrl
 * @param {String} params.fromAuthorize
 * @param {String} params.cli_token
 * @param {String} params.partner_id
 * @param {String} params.oauth_token
 * @param {String} params.invitationKey
 * @param {String} params.subscriptionSource
 * @returns {Promise<RequestParams>}
 */
export function todo_getOIDCLogin(params) {
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
 * @param {Object} params
 * @param {String} params.service
 * @param {String} params.redirectUrl
 * @param {String} params.fromAuthorize
 * @param {String} params.cli_token
 * @param {String} params.oauth_token
 * @param {String} params.invitationKey
 * @param {String} params.subscriptionSource
 * @param {String} params.terms
 * @param {String} params.partnerId
 * @returns {Promise<RequestParams>}
 */
export function todo_oidcSignup(params) {
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
 * @param {Object} params
 * @param {String} params.service
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_oidcSignupEnd(params, body) {
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
 * @param {Object} params
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getPasswordForgottenForm(params) {
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
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_askForPasswordResetViaForm(params, body) {
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
 * @param {Object} params
 * @param {String} params.key
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_confirmPasswordResetRequest(params) {
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
 * @param {Object} params
 * @param {String} params.key
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_resetPasswordForgotten(params, body) {
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
 * @param {Object} params
 * @param {String} params.token
 * @returns {Promise<RequestParams>}
 */
export function todo_getInvoiceStatusButton(params) {
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
 * @param {Object} params
 * @param {String} params.name
 * @returns {Promise<RequestParams>}
 */
export function todo_getCoupon(params) {
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
 * @returns {Promise<RequestParams>}
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
 * @returns {Promise<RequestParams>}
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
 * @param {Object} params
 * @param {String} params.Stripe-Signature
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_stripeSepaWebhook(params, body) {
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
 * @param {Object} params
 * @param {String} params.bid
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_endPaymentWithStripe(params, body) {
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
 * @param {Object} params
 * @param {String} params.bid
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_updateStripePayment(params, body) {
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
 * @param {Object} params
 * @param {String} params.provider_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getAddonProviderInfos(params) {
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
 * @param {Object} params
 * @param {String} params.provider_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getAddonProviderVersions(params) {
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
 * @returns {Promise<RequestParams>}
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
 * @returns {Promise<RequestParams>}
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
 * @param {Object} params
 * @param {String} params.context
 * @returns {Promise<RequestParams>}
 */
export function todo_getFlavors(params) {
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
 * @param {Object} params
 * @param {String} params.type
 * @param {String} params.version
 * @param {String} params.for
 * @param {String} params.app
 * @returns {Promise<RequestParams>}
 */
export function todo_getInstance(params) {
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
 * @returns {Promise<RequestParams>}
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
 * @param {Object} params
 * @param {String} params.coupon
 * @param {String} params.orgaId
 * @param {String} params.currency
 * @returns {Promise<RequestParams>}
 */
export function todo_getAvailablePackages(params) {
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
 * @param {Object} params
 * @param {String} params.invitationKey
 * @param {String} params.url_next
 * @param {String} params.subscription_source
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getSignupFormForSource(params) {
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
 * @param {Object} params
 * @param {String} params.secondaryEmailKey
 * @param {String} params.deletionKey
 * @param {String} params.fromAuthorize
 * @param {String} params.cli_token
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getLoginForm(params) {
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
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_login(params, body) {
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
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_mfaLogin(params, body) {
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
 * @param {Object} params
 * @param {String} params.invitationKey
 * @param {String} params.url_next
 * @param {String} params.subscription_source
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getSignupForm(params) {
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
 * @param {Object} params
 * @param {String} params.subscription_source
 * @param {String} params.invitationKey
 * @param {String} params.url_next
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getSignupFormForSource_1(params) {
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
 * @param {Object} params
 * @param {String} params.secondaryEmailKey
 * @param {String} params.deletionKey
 * @param {String} params.fromAuthorize
 * @param {String} params.cli_token
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getLoginForm_1(params) {
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
 * @param {Object} params
 * @param {String} params.invitationKey
 * @param {String} params.url_next
 * @param {String} params.subscription_source
 * @param {String} params.partner_id
 * @returns {Promise<RequestParams>}
 */
export function todo_getSignupForm_1(params) {
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
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function todo_getUser(params) {
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
 * @param {Object} params
 * @param {String} params.id
 * @returns {Promise<RequestParams>}
 */
export function todo_listUserApplications(params) {
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
 * @param {Object} params
 * @param {String} params.userId
 * @returns {Promise<RequestParams>}
 */
export function todo_getUserGitInformations(params) {
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
 * GET /validation/vat/{key}
 * @param {Object} params
 * @param {String} params.key
 * @param {String} params.action
 * @returns {Promise<RequestParams>}
 */
export function todo_validate(params) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'get',
    url: `/v2/validation/vat/${params.key}`,
    headers: { Accept: 'application/json' },
    queryParams: pickNonNull(params, ['action']),
    // no body
  });
}

/**
 * GET /vat_check
 * @param {Object} params
 * @param {String} params.country
 * @param {String} params.vat
 * @returns {Promise<RequestParams>}
 */
export function todo_checkVat(params) {
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
 * @param {Object} params
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_provisionOtherAddon(params, body) {
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
 * @param {Object} params
 * @param {String} params.offset
 * @returns {Promise<RequestParams>}
 */
export function todo_listApps(params) {
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
 * @param {Object} params
 * @param {String} params.addonId
 * @returns {Promise<RequestParams>}
 */
export function todo_getApplicationInfo(params) {
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
 * @param {Object} params
 * @param {String} params.addonId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_editApplicationConfiguration(params, body) {
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
 * @param {Object} params
 * @param {String} params.addonId
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_billOwner(params, body) {
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
 * @param {Object} params
 * @param {String} params.addonId
 * @returns {Promise<RequestParams>}
 */
export function todo_logscollector(params) {
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
 * @param {Object} params
 * @param {String} params.addonId
 * @param {String} params.plan_id
 * @param {String} params.region
 * @param {Object} body
 * @returns {Promise<RequestParams>}
 */
export function todo_endAddonMigration(params, body) {
  // no multipath for /self or /organisations/{id}
  return Promise.resolve({
    method: 'put',
    url: `/v2/vendor/apps/${params.addonId}/migration_callback`,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    queryParams: pickNonNull(params, ['plan_id', 'region']),
    body,
  });
}
