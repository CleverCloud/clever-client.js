# @clevercloud/client

🚧 **Beta Version - Work in Progress** 🚧

This is a beta version of the new Clever Cloud client library.
The API is subject to change, and some features may not be stable.
Use with caution in production environments.

---

A modern, comprehensive JavaScript client for Clever Cloud's APIs.
This library provides command-pattern clients for all Clever Cloud services with built-in authentication.

## Features

- 🔐 **Multiple Authentication Methods**: OAuth v1 PLAINTEXT and API tokens
- 🔄 **Automatic Resource Resolution**: Transparent handling of owner IDs and addon IDs
- 🎯 **Command Pattern**: Type-safe, composable API operations
- 🌊 **Real-time Streaming**: Server-Sent Events with auto-retry and health monitoring
- 🌐 **Universal**: Works in both Node.js (22+) and browser environments
- 📦 **Modular**: Import only what you need

## Installation

```bash
pnpm install @clevercloud/client
```

## Quick Start

```javascript
import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';
import { StreamApplicationRuntimeLogCommand } from '@clevercloud/client/cc-api-commands/log/stream-application-runtime-log-command.js';

// Create client with API token
const client = new CcApiClient({
  authMethod: {
    type: 'api-token',
    apiToken: 'your-api-token'
  }
});

// Or with OAuth v1
const client = new CcApiClient({
  authMethod: {
    type: 'oauth-v1',
    oauthTokens: {
      consumerKey: 'your-consumer-key',
      consumerSecret: 'your-consumer-secret',
      token: 'your-token',
      secret: 'your-token-secret'
    }
  }
});

// Send commands
const app = await client.send(new GetApplicationCommand({ applicationId: 'app_123' }));
console.log(`Application: ${app.name}`);

// Create real-time streams
const logStream = await client.stream(new StreamApplicationRuntimeLogCommand({
  applicationId: 'app_123'
}));
logStream.onLog(log => console.log(log.message));
await logStream.start();
```

## Available Clients

### CcApiClient

The main client for Clever Cloud's API, supporting all platform operations.

```javascript
import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
```

**Authentication Methods:**
- **API Token**: Recommended for most use cases
- **OAuth v1 PLAINTEXT**: For advanced integrations requiring user delegation

### CcApiBridgeClient

Specialised client for API token management operations.

```javascript
import { CcApiBridgeClient } from '@clevercloud/client/cc-api-bridge-client.js';
import { ListApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/list-api-token-command.js';

const bridgeClient = new CcApiBridgeClient({
  oauthTokens: { /* OAuth tokens */ }
});

const tokens = await bridgeClient.send(new ListApiTokenCommand());
```

### RedisHttpClient

HTTP proxy client for Redis addon management.

```javascript
import { RedisHttpClient } from '@clevercloud/client/redis-http-client.js';
import { CmdSendCommand } from '@clevercloud/client/redis-http-commands/cmd/cmd-send-command.js';

const redisClient = new RedisHttpClient({
  backendUrl: 'redis://my-redis-addon:6379'
});

const value = await redisClient.send(new CmdSendCommand({
  command: 'GET',
  args: ['my-key']
}));
```

## Core Concepts

### Command Pattern

All API operations are implemented as Command classes:

```javascript
import { CreateApplicationCommand } from '@clevercloud/client/cc-api-commands/application/create-application-command.js';
import { ListApplicationCommand } from '@clevercloud/client/cc-api-commands/application/list-application-command.js';
import { UpdateApplicationCommand } from '@clevercloud/client/cc-api-commands/application/update-application-command.js';
import { DeleteApplicationCommand } from '@clevercloud/client/cc-api-commands/application/delete-application-command.js';

// Create an application
const newApp = await client.send(new CreateApplicationCommand({
  ownerId: 'my-organisation',
  name: 'my-app',
  description: 'My awesome application',
  zone: 'par',
  minInstances: 1,
  maxInstances: 1,
  minFlavor: 'xs',
  maxFlavor: 'xs',
  buildFlavor: 's',
  instance: { slug: 'node' },
  deploy: 'git',
  branch: 'master',
}));

// List applications
const apps = await client.send(new ListApplicationCommand());

// Update application
await client.send(new UpdateApplicationCommand({
  applicationId: newApp.id,
  name: 'my-updated-app'
}));

// Delete application
await client.send(new DeleteApplicationCommand({
  applicationId: newApp.id
}));
```

### Values From a Newer API

A client may be older than the API it talks to.
When a command meets a value it does not know — a new cluster event, a new notification target, a new peer kind — it does not throw and does not drop the entry.
It publishes that one entry as an unknown variant carrying the raw payload:

```javascript
const events = await client.send(new ListKubernetesClusterEventCommand({ clusterId: 'cluster_123' }));

for (const event of events) {
  switch (event.event) {
    case 'CLUSTER_STATUS':
      console.log(`Cluster is now ${event.status}`);
      break;
    case 'UNKNOWN_TO_CLIENT':
      // This client is older than the API. `event.payload` holds what the server sent.
      console.warn('Unknown cluster event', event.payload);
      break;
  }
}
```

### Resource ID Resolution

The client automatically resolves and caches resource IDs, providing two key benefits:

1. **No ownerId required**: The client automatically resolves the owner ID for your resources
2. **Flexible addon IDs**: You can pass either the addon ID or the real addon ID

```javascript
// These all work automatically - no manual owner ID resolution needed
await client.send(new GetApplicationCommand({ applicationId: 'application_id' }));
await client.send(new GetAddonCommand({ addonId: 'addon_id_or_real_id' }));
```

#### Using the resolver directly

If you need to resolve IDs yourself (e.g. get the real addon ID, or find the owner of a resource), you can access the resolver directly on the client:

```javascript
// Translate an addon ID to its real ID (or the reverse)
const realAddonId = await client.resourceIdResolver.resolveAddonId('addon_xxx', 'REAL_ADDON_ID');
const addonId = await client.resourceIdResolver.resolveAddonId('postgresql_xxx', 'ADDON_ID');

// Resolve the owner ID of any resource
const ownerId = await client.resourceIdResolver.resolveOwnerId({ applicationId: 'app_xxx' });
const ownerId2 = await client.resourceIdResolver.resolveOwnerId({ addonId: 'addon_xxx' });
```

If the resource cannot be found, these methods throw a `CcClientError` with code `CANNOT_RESOLVE_RESOURCE_ID`.

### Persistent Storage for ID Resolution

By default, resource ID caching is stored in memory.
You can configure persistent storage for ID caching:

```javascript
// Browser environment
import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { LocalStorageStore } from '@clevercloud/client/cc-api-local-storage-store.js';

const client = new CcApiClient({
  authMethod: { /* ... */ },
  resourceIdResolverStore: new LocalStorageStore('cc-client-cache')
});

// Node.js environment
import { FileStore } from '@clevercloud/client/cc-api-file-store.js';

const client = new CcApiClient({
  authMethod: { /* ... */ },
  resourceIdResolverStore: new FileStore('/tmp/cc-client-cache.json')
});
```

### Real-time Streaming

The client supports real-time data streams via Server-Sent Events (SSE) for live updates like application logs, access logs, ...

```javascript
import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import { StreamApplicationRuntimeLogCommand } from '@clevercloud/client/cc-api-commands/log/stream-application-runtime-log-command.js';

// Create client
const client = new CcApiClient({ authMethod: {/* ... */} });

// Create stream without starting
const stream = await client.stream(new StreamApplicationRuntimeLogCommand({
  applicationId: 'app_123'
}));

// Set up event handlers before starting
stream
  .onOpen(() => updateUI('streaming'))
  .onLog(log => updateUI('newLog', log))
  // { error, retryCount, maxRetryCount, retryAt }: calling stream.pause() from here cancels the retry
  .onRetry(retry => updateUI('reconnecting', retry));

// Start streaming
stream.start()
  .then((reason) => updateUI('streamingEnded', reason))
  .catch((error) => handleFatalError(error));

// Check stream status
console.log(stream.state); // 'init', 'connecting', 'open', 'retrying', 'paused' or 'closed'

// Gracefully stop the stream
stream.stop();
```

**Key Features:**
- **Auto-retry**: Automatic reconnection with exponential backoff
- **Health monitoring**: Built-in connection health checks
- **Resource ID resolution**: Same automatic resolution as regular commands
- **Configurable**: Customisable retry behaviour and timeouts

### Stream Configuration

Configure streaming behaviour at the client or stream level:

```javascript
// Configure default streaming settings for all streams
const client = new CcApiClient({
  authMethod: { /* ... */ },
  defaultStreamConfig: {
    retry: {
      maxRetryCount: 10, // Maximum retry attempts
      initRetryTimeout: 1000, // Initial retry delay (ms)
      backoffFactor: 1.5 // Exponential backoff multiplier
    },
    heartbeatPeriod: 2500, // Expected heartbeat interval (ms)
    healthcheckInterval: 1000, // Health check frequency (ms)
    debug: true // Enable stream debugging
  }
});

// Override stream settings for individual streams
const logStream = await client.stream(
  new ApplicationLogsStreamCommand({ applicationId: 'app_123' }),
  {
    retry: { maxRetryCount: 5 }, // Override retry count
    debug: false // Disable debug for this stream
  }
);
```

### Stream Configuration Options

| Option                   | Type      | Default    | Description                                 |
|--------------------------|-----------|------------|---------------------------------------------|
| `retry.maxRetryCount`    | `number`  | `Infinity` | Maximum number of reconnection attempts     |
| `retry.initRetryTimeout` | `number`  | `1000`     | Initial retry delay in milliseconds         |
| `retry.backoffFactor`    | `number`  | `1.25`     | Exponential backoff multiplier for retries  |
| `heartbeatPeriod`        | `number`  | `2500`     | Expected heartbeat interval in milliseconds |
| `healthcheckInterval`    | `number`  | `1000`     | Health check frequency in milliseconds      |
| `debug`                  | `boolean` | `false`    | Enable detailed stream debugging output     |

## Request Configuration

Configuration is handled at two levels:

### 1. Instance-Level (Default Configuration)

Set the default request configuration when creating the client:

```javascript
const client = new CcApiClient({
  authMethod: { /* ... */ },
  defaultRequestConfig: {
    timeout: 30000, // Request timeout in milliseconds
    debug: true, // Enable request/response logging
    cors: true, // Enable CORS
    cache: { ttl: 300000 }, // Enable response caching with a TTL of 5 minutes
    signal: abortController.signal // For request cancellation
  }
});
```

### 2. Command-Level (Override Configuration)

Override default configuration per command:

```javascript
// Override instance defaults for this specific request
const result = await client.send(
  new GetApplicationCommand({ applicationId: 'app_123' }),
  {
    timeout: 60000, // Override default timeout
    debug: false, // Disable debug for this request
    cache: { mode: 'reload' }, // Force fresh fetch and update cache
  }
);
```

### Available Request Configuration Options

| Option       | Type          | Default | Description                                      |
|--------------|---------------|---------|--------------------------------------------------|
| `timeout`    | `number`      | `0`     | Request timeout in milliseconds (0 = no timeout) |
| `debug`      | `boolean`     | `false` | Enable request/response logging                  |
| `cors`       | `boolean`     | `false` | Enable CORS for cross-origin requests            |
| `cache`      | `Object`      | `null`  | Response caching behaviour                       |
| `cacheDelay` | `number`      | `0`     | Cache validity time in milliseconds              |
| `signal`     | `AbortSignal` | -       | AbortSignal for request cancellation             |

### Response Caching

The client includes built-in response caching to improve performance and reduce API calls:

```javascript
const client = new CcApiClient({
  authMethod: { /* ... */ },
  defaultRequestConfig: {
    cache: { ttl: 300000 }, // Cache responses for 5 minutes
  }
});

// First call - fetches from API and caches response
const app1 = await client.send(new GetApplicationCommand({ applicationId: 'app_123' }));

// Second call within 5 minutes - returns cached response
const app2 = await client.send(new GetApplicationCommand({ applicationId: 'app_123' }));

// Force fresh fetch and update cache
const app3 = await client.send(
  new GetApplicationCommand({ applicationId: 'app_123' }),
  { cache: { mode: 'reload' } }
);
```

**Cache Behaviour:**
- `cache: null` - Always fetch from network (no caching)
- `cache: { ttl: 1000 }` - Use cached response if available and within `ttl`
- `cache: { ttl: 1000, mode: 'reload' }` - Force network fetch and update cache with the given `ttl`.

**Cache Key:** Responses are cached using a combination of:
- URL
- Query parameters
- `Accept` and `Authorization` headers

**Important Notes:**
- Only `GET` requests are cached
- Cache is stored in memory and shared across all client instances
- Cache entries automatically expire after `ttl` milliseconds

### Debug Configuration

The client provides comprehensive request/response debugging with security considerations:

```javascript
const client = new CcApiClient({
  authMethod: { /* ... */ },
  defaultRequestConfig: {
    debug: true // Enable debug logging
  }
});
```

**Debug Output Includes:**
- Request details (method, URL, headers, query parameters)
- Response details (status, headers, body)
- Request duration in milliseconds

**Security Features:**
- Authorization headers are obfuscated and replaced with `***`
- Authorization query parameters are obfuscated and replaced with `***`

**Debug Modes:**
- `debug: false` - No debug output
- `debug: true` - JSON debug logging to console

## Other Client Configuration

### Hooks Configuration

Customise client behaviour with lifecycle hooks:

```javascript
const client = new CcApiClient({
  authMethod: { /* ... */ },
  hooks: {
    // Modify requests before they're sent
    onRequest: async (requestParams) => {
      requestParams.headers.append('X-Custom-Header', 'my-value');
      requestParams.queryParams.append('custom-param', 'my-value');
    },

    // Process responses after they're received
    onResponse: async (response) => {
      console.log(`API call completed: ${response.status}`);
      // Log metrics, update UI, etc.
    },

    // Handle errors when they occur
    onError: async (error) => {
      console.error('API error occurred:', error.message);
      // Send to error tracking service, show notifications, etc.
    }
  }
});
```

### Available Hooks

| Hook         | Type                                          | Description                              |
|--------------|-----------------------------------------------|------------------------------------------|
| `onRequest`  | `(request: Partial<CcRequestParams>) => void` | Modify request parameters before sending |
| `onResponse` | `(response: CcResponse) => void`              | Process successful responses             |
| `onError`    | `(error: any) => void`                        | Handle errors during request processing  |

### Base URL Configuration

```javascript
// Custom API endpoint (rarely needed)
const client = new CcApiClient({
  baseUrl: 'https://preprod-api.clever-cloud.com',
  authMethod: { /* ... */ }
});
```

### Authentication Configuration

See the [Available Clients](#available-clients) section for detailed authentication setup.

### Resource ID Storage Configuration

See the [Persistent Storage for ID Resolution](#persistent-storage-for-id-resolution) section for storage configuration options.

## Error Handling

The client provides a comprehensive error system with three distinct error types.
Use the utility functions for best practices:

```javascript
import { isCcClientError, isCcRequestError, isCcHttpError } from '@clevercloud/client/utils/error-utils.js';

try {
  const result = await client.send(command);
} catch (error) {
  if (isCcHttpError(error)) {
    // Server returned an error response (3xx, 4xx, 5xx)
    console.error(`HTTP ${error.statusCode}: ${error.message}`);
    console.error('Response body:', error.response.body);
  } else if (isCcRequestError(error)) {
    // Network or request configuration error
    console.error(`Request error: ${error.message}`);
    console.error('Failed request:', error.request.url);
  } else if (isCcClientError(error)) {
    // Client-side logic error (resource resolution, etc.)
    console.error(`Client error: ${error.message} (${error.code})`);
  } else {
    // Unexpected error
    console.error('Unexpected error:', error.message);
  }
}
```

### Error Types

#### CcHttpError
Thrown when the server returns an error response (non-2xx status codes):

```javascript
if (isCcHttpError(error)) {
  console.log(error.statusCode); // HTTP status code (e.g., 404, 500)
  console.log(error.response.body); // Server response body
  console.log(error.request.url); // Original request URL
}
```

#### CcRequestError  
Thrown for network errors, timeouts, or request configuration issues:

```javascript
if (isCcRequestError(error)) {
  console.log(error.request.method); // HTTP method
  console.log(error.request.url); // Request URL
  console.log(error.code); // Error code (NETWORK_ERROR, TIMEOUT_EXCEEDED, etc.)
}
```

#### CcClientError
Thrown for client-side logic errors (resource resolution failures, invalid configurations):

```javascript
if (isCcClientError(error)) {
  console.log(error.code); // Error code (CANNOT_RESOLVE_RESOURCE_ID, etc.)
  console.log(error.message); // Human-readable error message
}
```

### Narrowing on a status or a code

The error classes are not part of the public API, so `error instanceof CcHttpError` is not available to consumers.
Rather than duck-typing on `error.statusCode` or `error.code` — which matches any object that happens to carry those properties, whatever its origin — use the dedicated predicates:

```javascript
import {
  isCcHttpErrorWithStatus,
  isCcHttpErrorWithCode,
  isRateLimitError,
} from '@clevercloud/client/utils/error-utils.js';

try {
  await client.send(command);
} catch (error) {
  if (isCcHttpErrorWithStatus(error, 404)) {
    // The resource does not exist
  } else if (isRateLimitError(error)) {
    // Rate limited
  } else if (isCcHttpErrorWithCode(error, 'clever.core.forbidden')) {
    // The server refused the operation
  } else {
    throw error;
  }
}
```

`isCcHttpErrorWithCode()` matches the code resolved by the client: either the code parsed from the response body and mapped by the command (see [Command-Specific Error Codes](#command-specific-error-codes)), or one of the cross-cutting codes the client normalizes itself.
All three predicates are TypeScript type guards, so `error` is narrowed to `CcHttpError` inside the branch and `error.statusCode` / `error.response.body` are typed.

### Common Error Codes

| Error Code                   | Error Type     | Description                         |
|------------------------------|----------------|-------------------------------------|
| `TIMEOUT_EXCEEDED`           | CcClientError  | Request timeout exceeded            |
| `NETWORK_ERROR`              | CcRequestError | Network connectivity issues         |
| `INVALID_URL`                | CcRequestError | Malformed request URL               |
| `UNEXPECTED_ERROR`           | CcRequestError | Unexpected request processing error |
| `CANNOT_RESOLVE_RESOURCE_ID` | CcClientError  | Resource ID resolution failed       |

### Command-Specific Error Codes

On top of the codes above, a command may translate the codes returned by its endpoint into named, documented codes.
Those codes are exported as a constant next to the command class, so consumers never have to hardcode the string:

```javascript
import {
  ActivateCouponCommand,
  ACTIVATE_COUPON_ERROR_CODES,
} from '@clevercloud/client/cc-api-commands/credits/activate-coupon-command.js';
import { isCcHttpErrorWithCode } from '@clevercloud/client/utils/error-utils.js';

try {
  await client.send(new ActivateCouponCommand({ ownerId, couponName }));
} catch (error) {
  if (isCcHttpErrorWithCode(error, ACTIVATE_COUPON_ERROR_CODES.ALREADY_ACTIVATED)) {
    // ...
  } else {
    throw error;
  }
}
```

## Environment-Specific Usage

The client works identically in both Node.js and browser environments.
The only difference is the optional `resourceIdResolverStore` configuration for persistent ID caching:

### Browser Environment

```javascript
import { LocalStorageStore } from '@clevercloud/client/cc-api-local-storage-store.js';

const client = new CcApiClient({
  authMethod: { /* ... */ },
  resourceIdResolverStore: new LocalStorageStore('cc-cache') // Browser storage
});
```

### Node.js Environment

```javascript
import { FileStore } from '@clevercloud/client/cc-api-file-store.js';

const client = new CcApiClient({
  authMethod: { /* ... */ },
  resourceIdResolverStore: new FileStore('./cc-cache.json') // File storage
});
```

## TypeScript Support

The library includes comprehensive TypeScript definitions:

```typescript
import { CcApiClient } from '@clevercloud/client/cc-api-client.js';
import type { Application } from '@clevercloud/client/cc-api-commands/application/application.types.js';
import { GetApplicationCommand } from '@clevercloud/client/cc-api-commands/application/get-application-command.js';

const client = new CcApiClient({
  authMethod: {
    type: 'api-token',
    apiToken: process.env.CC_API_TOKEN!,
  },
});
const app: Application = await client.send(new GetApplicationCommand({ applicationId: 'my-app-id' }));
```

## API Bridge Client

The API Bridge client is specialised for managing API tokens and requires OAuth v1 authentication:

```javascript
import { CcApiBridgeClient } from '@clevercloud/client/cc-api-bridge-client.js';
import { CreateApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/create-api-token.command.js';
import { ListApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/list-api-token.command.js';
import { UpdateApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/update-api-token.command.js';
import { DeleteApiTokenCommand } from '@clevercloud/client/cc-api-bridge-commands/api-token/delete-api-token.command.js';

const bridgeClient = new CcApiBridgeClient({
  oauthTokens: {
    consumerKey: 'your-consumer-key',
    consumerSecret: 'your-consumer-secret',
    token: 'your-oauth-token',
    secret: 'your-oauth-secret'
  }
});

// Create API token
const newToken = await bridgeClient.send(new CreateApiTokenCommand({
  name: 'My App Token',
  description: 'Token for my application'
}));

// List all API tokens
const tokens = await bridgeClient.send(new ListApiTokenCommand());

// Update token
await bridgeClient.send(new UpdateApiTokenCommand({
  tokenId: newToken.id,
  name: 'Updated Token Name'
}));

// Delete token
await bridgeClient.send(new DeleteApiTokenCommand({
  tokenId: newToken.id
}));
```

## Redis Client

The Redis HTTP client provides full Redis command support through HTTP proxy:

```javascript
import { RedisHttpClient } from '@clevercloud/client/redis-http-client.js';
import { CmdSendCommand } from '@clevercloud/client/redis-http-commands/cmd/cmd-send-command.js';
import { CreateStringKeyCommand } from '@clevercloud/client/redis-http-commands/string-key/create-string-key-command.js';
import { GetStringKeyCommand } from '@clevercloud/client/redis-http-commands/string-key/get-string-key-command.js';
import { ScanKeyCommand } from '@clevercloud/client/redis-http-commands/key/scan-key-command.js';

const redisClient = new RedisHttpClient({
  backendUrl: 'redis://my-addon:6379'
});

// String operations
await redisClient.send(new CreateStringKeyCommand({
  key: 'user:123',
  value: 'John Doe'
}));

const value = await redisClient.send(new GetStringKeyCommand({
  key: 'user:123'
}));

// Key scanning
const keys = await redisClient.send(new ScanKeyCommand({
  pattern: 'user:*'
}));

// Raw Redis commands
const result = await redisClient.send(new CmdSendCommand({
  command: 'HGETALL',
  args: ['user:profile:123']
}));
```

## Writing Your Own Client

The clients above are built on a base that is published too: `@clevercloud/client/cc-client.js`.
Use it to write a client for another HTTP API — a backend of your own, a proxy in front of a service — and get the same request pipeline as the Clever Cloud clients: hooks, timeouts, caching, cancellation, and the same errors.

A client extends `CcClient`, and its commands extend `SimpleCommand` (one request) or `CompositeCommand` (several commands sent in sequence).
The type parameter names the API they belong to, so a command of one client cannot be sent to another.

```typescript
import {
  CcClient,
  type CcRequestParams,
  CompositeCommand,
  type Composer,
  get,
  postJson,
  QueryParams,
  safeUrl,
  SimpleCommand,
} from '@clevercloud/client/cc-client.js';
import { isCcHttpErrorWithStatus } from '@clevercloud/client/utils/error-utils.js';

type MyApi = 'my-api';

// the client: a base URL, and whatever every request needs
export class MyApiClient extends CcClient<MyApi> {
  constructor(options: { onUnauthorized: () => void }) {
    super({
      // an absolute URL, or in a browser a URL relative to the page
      baseUrl: '/my-api',
      hooks: {
        onRequest: (requestParams) => {
          requestParams.headers.set('X-Requested-By', 'my-app');
        },
        onError: (error) => {
          if (isCcHttpErrorWithStatus(error, 401)) {
            options.onUnauthorized();
          }
        },
      },
    });
  }
}

// a base class for the commands of that API
abstract class MyApiCommand<Input, Output> extends SimpleCommand<MyApi, Input, Output> {
  get api(): MyApi {
    return 'my-api';
  }
}

interface Widget {
  id: string;
  name: string;
}

export class GetWidgetCommand extends MyApiCommand<{ widgetId: string; expand?: boolean }, Widget> {
  toRequestParams(params: { widgetId: string; expand?: boolean }): Partial<CcRequestParams> {
    // `safeUrl` encodes every interpolated value
    return get(safeUrl`/widgets/${params.widgetId}`, new QueryParams({ expand: params.expand }));
  }

  // optional: turn the response body into the output of the command
  override transformCommandOutput(response: unknown): Widget {
    const payload = response as { widget_id: string; widget_name: string };
    return { id: payload.widget_id, name: payload.widget_name };
  }

  // optional: sending it twice changes nothing, so a caller may retry it
  override isIdempotent(): boolean {
    return true;
  }
}

export class CreateWidgetCommand extends MyApiCommand<{ name: string }, Widget> {
  toRequestParams(params: { name: string }): Partial<CcRequestParams> {
    return postJson('/widgets', { widget_name: params.name });
  }

  override transformCommandOutput(response: unknown): Widget {
    const payload = response as { widget_id: string; widget_name: string };
    return { id: payload.widget_id, name: payload.widget_name };
  }
}

export class CreateAndGetWidgetCommand extends CompositeCommand<MyApi, { name: string }, Widget> {
  get api(): MyApi {
    return 'my-api';
  }

  async compose(params: { name: string }, composer: Composer<MyApi>): Promise<Widget> {
    const { id } = await composer.send(new CreateWidgetCommand(params));
    return composer.send(new GetWidgetCommand({ widgetId: id }));
  }
}

// usage
const client = new MyApiClient({ onUnauthorized: () => redirectToLogin() });
const widget = await client.send(new GetWidgetCommand({ widgetId: 'w1' }), { signal: abortController.signal });
```

What the entry point exports:

| Export                                                                            | Purpose                                                                          |
|-----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| `CcClient`                                                                        | The base client, its constructor takes a `CcClientConfig`, an optional `CcAuth` and an optional `CcClientParamsTransformer` |
| `SimpleCommand`, `CompositeCommand`                                               | The base command classes                                                         |
| `AbstractCommand`                                                                 | What both extend, to name any of them, or to share code between the base command classes of an API |
| `StreamCommand`, `CcStream`, `CcStreamEvent`                                      | The base classes of a stream command and of the stream it opens, see below      |
| `CcAuth`                                                                          | The base class for an authentication: implement `getAuthorization()`, which returns the `Authorization` header value |
| `get`, `post`, `postJson`, `put`, `putJson`, `patch`, `patchJson`, `head`, `delete_` | Build the request params of a command                                         |
| `QueryParams`, `safeUrl`                                                          | Build the query string, and a path with encoded values                           |
| `HeadersBuilder`                                                                  | Build the headers of a request: `acceptJson()`, `acceptEventStream()`, `contentTypeJson()`, `authorization()`… |
| `CcClientConfig`, `CcClientHooks`, `CcClientParamsTransformer`, `OnRequestHook`, `OnResponseHook`, `OnErrorHook` | Types of the client configuration                                              |
| `CcRequestParams`, `CcRequestConfig`, `CcRequestConfigPartial`, `CcRequest`, `CcResponse`… | Types of requests and responses                                         |
| `Command`, `Composer`, `ApiErrorInfo`                                             | Types of commands                                                                |
| `CcStreamConfig`, `CcStreamConfigPartial`, `RetryConfig`, `CcStreamRequestFactory`, `CcStreamState`… | Types of streams                                             |
| `CcClientError`, `CcRequestError`, `CcHttpError`, `CcNetworkError`                | Types of the errors, see below                                                   |

The error classes are exported as types only, like everywhere else in this package: narrow an error with the predicates of `@clevercloud/client/utils/error-utils.js` (see [Error Handling](#error-handling)), which also recognise the errors raised by another copy of the package.

A command can also:

- override `transformErrorCode()` to map the error codes of its API to its own;
- override `isAuthEnabled()` to return `false`, so that the client authentication is not applied to it;
- override `getRequestConfig()` to state the request configuration its endpoint needs, which the configuration given to `send()` still overrides.

A client can also transform the params of every command before they become a request, for example to fill in a default value or to resolve an id.
Pass a `CcClientParamsTransformer` as the third argument of the `CcClient` constructor: its `transformParams(command, requestConfig)` returns the params a simple, composite or stream command is sent with.
Without it, the params are sent as the command holds them.

```typescript
import type { CcClientParamsTransformer } from '@clevercloud/client/cc-client.js';

const paramsTransformer: CcClientParamsTransformer<MyApi> = {
  transformParams: async (command) => ({ region: 'par', ...(command.params as object) }),
};

export class MyApiClient extends CcClient<MyApi> {
  constructor() {
    super({ baseUrl: '/my-api' }, undefined, paramsTransformer);
  }
}
```

### Streams

A stream command opens a Server-Sent Events stream, with the same retries, heartbeat monitoring and cancellation as the streams of `CcApiClient`.
It builds its request like a simple command, and creates the stream the client then opens:

```typescript
import {
  CcStream,
  type CcStreamConfig,
  type CcStreamRequestFactory,
  type CcRequestParams,
  HeadersBuilder,
  safeUrl,
  StreamCommand,
} from '@clevercloud/client/cc-client.js';

// the stream: one method per kind of event, named after the `event` field of the SSE messages
export class WidgetEventsStream extends CcStream {
  onWidgetEvent(callback: (widget: Widget) => void): this {
    return this.on<string>('WIDGET', (event) => {
      callback(JSON.parse(event.data) as Widget);
    });
  }
}

export class StreamWidgetEventsCommand extends StreamCommand<MyApi, { widgetId: string }, WidgetEventsStream> {
  get api(): MyApi {
    return 'my-api';
  }

  toRequestParams(params: { widgetId: string }): Partial<CcRequestParams> {
    return {
      method: 'GET',
      url: safeUrl`/widgets/${params.widgetId}/events`,
      headers: new HeadersBuilder().acceptEventStream().build(),
    };
  }

  createStream(requestFactory: CcStreamRequestFactory, config: CcStreamConfig): WidgetEventsStream {
    return new WidgetEventsStream(requestFactory, config);
  }
}

// usage
const stream = await client.stream(new StreamWidgetEventsCommand({ widgetId: 'w1' }));
stream.onWidgetEvent((widget) => console.log(widget));
await stream.start();
```

The client handles the `HEARTBEAT` and `END_OF_STREAM` events itself.
See [Real-time Streaming](#real-time-streaming) for the rest of the stream API.

An application only ships what it imports from this entry point: one that never uses a stream does not ship `CcStream`.

## Support

This library provides comprehensive access to Clever Cloud's platform APIs.
For questions about the platform or API behaviour, refer to the [Clever Cloud documentation](https://www.clever.cloud/developers/).

For issues with this client library, please file bug reports on the [GitHub repository](https://github.com/CleverCloud/clever-client.js).

---

**⚠️ Beta Notice**: This documentation covers the new command-pattern client.
APIs and interfaces may change in future versions.
