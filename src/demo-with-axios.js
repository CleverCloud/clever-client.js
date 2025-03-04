import { CleverClient } from './clever-client.js';
import { prepareRequestPrefixUrl } from './plugins/prepare-request-prefix-url.js';
import { prepareRequestAuthV1Plaintext } from './plugins/prepare-request-oauth-v1-plaintext.js';
import { prepareRequestWithDefaults } from './plugins/prepare-request-with-defaults.js';
import { requestWrapperTimeout } from './plugins/request-wrapper-timeout.js';
import { requestWrapperWithCache } from './plugins/request-wrapper-with-cache.js';
import { GetSelfCommand } from './commands/get-self-command.js';
import { requestWrapperDebug } from './plugins/request-wrapper-debug.js';
import {
  isCleverClientError,
  isCleverHttpError,
} from './errors/clever-client-errors.js';
import { requestAdapterAxios } from './request/request-adapter-axios.js';

const apiConfig = {
  API_HOST: 'https://api.clever-cloud.com',
  OAUTH_CONSUMER_KEY: process.env.OAUTH_CONSUMER_KEY,
  OAUTH_CONSUMER_SECRET: process.env.OAUTH_CONSUMER_SECRET,
  API_OAUTH_TOKEN: process.env.API_OAUTH_TOKEN,
  API_OAUTH_TOKEN_SECRET: process.env.API_OAUTH_TOKEN_SECRET,
};

function createCleverClient () {
  return (
    new CleverClient(requestAdapterAxios)
      // prefix url with API host
      .register(prepareRequestPrefixUrl(apiConfig.API_HOST))
      // enable oauth v1 authentication
      .register(
        prepareRequestAuthV1Plaintext(
          apiConfig.OAUTH_CONSUMER_KEY,
          apiConfig.OAUTH_CONSUMER_SECRET,
          apiConfig.API_OAUTH_TOKEN,
          apiConfig.API_OAUTH_TOKEN_SECRET,
        ),
      )
      // enables cors by default
      .register(prepareRequestWithDefaults({ cors: true }))
      // enable request timeout handling
      .register(requestWrapperTimeout())
      // debug requests and responses
      .register(requestWrapperDebug(console.log))
      // enable request caching
      .register(requestWrapperWithCache())
      // add an onResponse hook that checks for 401 errors
      .register({
        type: 'onResponse',
        handle (response) {
          if (response.status === 401) {
            console.error('UNAUTHORIZED !!!');
            // logout!!
          }
        },
      })
      // add an onError hook that do things on certain errors
      .register({
        type: 'onError',
        handle (error) {
          if (isCleverClientError(error) && !isCleverHttpError(error)) {
            // warn team infra: APIs are unstable!!!
          }
          else if (!isCleverClientError(error)) {
            // glitchtip: something when wrong in the lib!!!
          }
        },
      })
  );
}

async function run () {
  const cleverClient = createCleverClient();

  try {
    const commandResponse = await cleverClient.run(new GetSelfCommand());
    const userEmail = commandResponse.body.email;
    console.log(`You are connected as ${userEmail}`);
  }
  catch (e) {
    console.log('oups');
    console.error(e);
  }

  console.log(
    '*******************************************************************************************************************',
  );

  try {
    const commandResponse = await cleverClient.run({ url: '/' });
    const untypedBOdy = commandResponse.body;
    console.log(untypedBOdy);
  }
  catch (e) {
    console.error(e);
  }
}

run();
