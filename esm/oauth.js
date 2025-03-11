import OAuth from 'oauth-1.0a';

/**
 * @typedef {import('./oauth.types.js').OAuthTokens} OAuthTokens
 * @typedef {import('./request.types.js').RequestParams} RequestParams
 */

/**
 * @param {OAuthTokens} tokens
 * @returns {(requestParams: RequestParams) => Promise<RequestParams>}
 */
export function addOauthHeader(tokens) {
  return async function (requestParams) {
    const { method, url, headers, queryParams } = requestParams;

    // @ts-ignore
    const oauth = new OAuth({
      consumer: {
        key: tokens.OAUTH_CONSUMER_KEY,
        secret: tokens.OAUTH_CONSUMER_SECRET,
      },
      // eslint-disable-next-line camelcase
      signature_method: 'HMAC-SHA512',
      // @ts-ignore
      // eslint-disable-next-line camelcase
      async hash_function(baseString, key) {
        const encoder = new TextEncoder();
        const encodedText = encoder.encode(baseString);
        const encodedKey = encoder.encode(key);

        const cryptoKey = await globalThis.crypto.subtle.importKey(
          'raw',
          encodedKey,
          { name: 'HMAC', hash: 'SHA-512' },
          false,
          ['sign'],
        );

        const result = await globalThis.crypto.subtle.sign({ name: 'HMAC', hash: 'SHA-512' }, cryptoKey, encodedText);

        let binary = '';
        const bytes = new Uint8Array(result);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Result = globalThis.btoa(binary);

        return base64Result;
      },
    });

    const requestData = { url, method, data: queryParams };
    const oauthData = oauth.authorize(requestData, {
      key: tokens.API_OAUTH_TOKEN,
      secret: tokens.API_OAUTH_TOKEN_SECRET,
    });
    // unwrap promise
    // eslint-disable-next-line camelcase
    oauthData.oauth_signature = await oauthData.oauth_signature;
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
