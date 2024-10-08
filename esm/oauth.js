import OAuth from 'oauth-1.0a';

export function addOauthHeader (tokens) {

  return async function (requestParams) {

    const { method, url, headers, queryParams } = requestParams;

    const oauth = OAuth({
      consumer: {
        key: tokens.OAUTH_CONSUMER_KEY,
        secret: tokens.OAUTH_CONSUMER_SECRET,
      },
      signature_method: 'HMAC-SHA512',
      async hash_function (baseString, key) {

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

        const result = await globalThis.crypto.subtle.sign(
          { name: 'HMAC', hash: 'SHA-512' },
          cryptoKey,
          encodedText,
        );

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
