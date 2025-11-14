# @clevercloud/client

🚧 **Beta Version - Work in Progress** 🚧

This is a beta version of the new Clever Cloud client library.
The API is subject to change, and some features may not be stable. Use with caution in production environments.

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
npm install @clevercloud/client
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

### Resource ID Resolution

The client automatically resolves and caches resource IDs, providing two key benefits:

1. **No ownerId required**: The client automatically resolves the owner ID for your resources
2. **Flexible addon IDs**: You can pass either the addon ID or the real addon ID

```javascript
// These all work automatically - no manual owner ID resolution needed
await client.send(new GetApplicationCommand({ applicationId: 'application_id' }));
await client.send(new GetAddonCommand({ addonId: 'addon_id_or_real_id' }));
```

### Persistent Storage for ID Resolution

By default, resource ID caching is stored in memory. You can configure persistent storage for ID caching:

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
  .onError(error => updateUI('retryableErrorOccurred', error, stream.retryCount));

// Start streaming
stream.start()
  .then((reason) => updateUI('streamingEnded', reason))
  .catch((error) => handleFatalError(error));

// Check stream status
console.log(stream.state); // 'init', 'connecting', 'open', 'paused' or 'closed'

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

The client provides a comprehensive error system with three distinct error types. Use the utility functions for best practices:

```javascript
import { isCcClientError, isCcRequestError, isCcHttpError } from '@clevercloud/client/utils/errors.js';

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

### Common Error Codes

| Error Code                   | Error Type     | Description                         |
|------------------------------|----------------|-------------------------------------|
| `TIMEOUT_EXCEEDED`           | CcClientError  | Request timeout exceeded            |
| `NETWORK_ERROR`              | CcRequestError | Network connectivity issues         |
| `INVALID_URL`                | CcRequestError | Malformed request URL               |
| `UNEXPECTED_ERROR`           | CcRequestError | Unexpected request processing error |
| `CANNOT_RESOLVE_RESOURCE_ID` | CcClientError  | Resource ID resolution failed       |

## Environment-Specific Usage

The client works identically in both Node.js and browser environments. The only difference is the optional `resourceIdResolverStore` configuration for persistent ID caching:

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

## Support

This library provides comprehensive access to Clever Cloud's platform APIs. For questions about the platform or API behaviour, refer to the [Clever Cloud documentation](https://www.clever.cloud/developers/).

For issues with this client library, please file bug reports on the [GitHub repository](https://github.com/CleverCloud/clever-client.js).

---

**⚠️ Beta Notice**: This documentation covers the new command-pattern client. APIs and interfaces may change in future versions.
