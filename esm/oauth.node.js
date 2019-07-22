import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export function addOauthHeader (tokens) {

  return function (requestParams) {

    const { method, url, headers, queryParams } = requestParams;

    const oauth = OAuth({
      consumer: {
        key: tokens.OAUTH_CONSUMER_KEY,
        secret: tokens.OAUTH_CONSUMER_SECRET,
      },
      signature_method: 'HMAC-SHA512',
      hash_function (baseString, key) {
        return crypto
          .createHmac('sha512', key)
          .update(baseString)
          .digest('base64');
      },
    });

    const requestData = { url, method, data: queryParams };
    const oauthData = oauth.authorize(requestData, {
      key: tokens.API_OAUTH_TOKEN,
      secret: tokens.API_OAUTH_TOKEN_SECRET,
    });
    const oauthHeaders = oauth.toHeader(oauthData);

    return {
      ...requestParams,
      headers: {
        ...oauthHeaders,
        ...headers,
      },
    };
  };
}
