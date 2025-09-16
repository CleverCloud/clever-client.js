# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Building
- `npm run build` - Build the project with Rollup
- `npm run prepack:dev` - Development build only
- `npm run prepack:prod` - Full production build with format check, lint, typecheck, tests
- `npm run prepack` - Smart prepack (dev or prod based on DEV env var)

### Testing
- `npm run test` - Run all unit tests (browser + Node.js)
- `npm run test:unit` - Same as test (unit tests only)
- `npm run test:unit:browser` - Browser unit tests with Web Test Runner
- `npm run test:unit:browser:watch` - Watch mode for browser unit tests
- `npm run test:unit:node` - Node.js unit tests with Mocha
- `npm run test:unit:node:watch` - Watch mode for Node.js unit tests
- `npm run test:unit:watch` - Watch mode for unit tests (both environments)
- `npm run test:e2e` - End-to-end tests (browser + Node.js)
- `npm run test:e2e:browser` - Browser e2e tests
- `npm run test:e2e:node` - Node.js e2e tests

### Linting & Formatting
- `npm run lint` - ESLint check
- `npm run lint:fix` - ESLint auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - TypeScript type checking

### Analysis & Generation
- `npm run endpoints-generate` - Generate API endpoints from OpenAPI specs
- `npm run endpoints-list` - List all available endpoints
- `npm run endpoints-analyze` - Analyze endpoint usage
- `npm run api-usage-analyze` - Analyze API usage across console3, clever-components, clever-tools

## Architecture Overview

This is the **@clevercloud/client** package - a comprehensive JavaScript REST client for Clever Cloud's APIs. The project provides multiple client implementations and both modern command-pattern clients and legacy functional clients.

### Core Architecture Components

#### 1. Client Implementations (`src/clients/`)
- **cc-api/**: Main Clever Cloud API client with OAuth v1 and API token auth
- **cc-api-bridge/**: Bridge client for API token management  
- **redis-http/**: Redis HTTP client for Redis addon management

#### 2. Base Library (`src/lib/`)
- **cc-client.js**: Base client class with HTTP handling, auth, and streaming
- **auth/**: Authentication implementations (OAuth v1, API tokens)
- **command/**: Command pattern implementation for API operations
- **request/**: HTTP request handling, caching, debugging
- **stream/**: Server-Sent Events streaming with auto-retry
- **error/**: Error handling and HTTP status code management

#### 3. Command Pattern Structure
Each API operation is implemented as a Command class:
- Commands are located in `src/clients/{client}/commands/{domain}/`
- Each command has a main `.js` file and `.types.d.ts` for TypeScript definitions
- Commands handle request building, response transformation, and validation

#### 4. Legacy Client (`esm/`)
Functional API client for backward compatibility:
- Functions for each API endpoint
- OAuth utilities and request helpers
- Streaming implementations for logs and events

### Key Patterns

#### Authentication
The project supports multiple auth methods:
- **OAuth v1 PLAINTEXT**: For secure token-based auth
- **API tokens**: Simpler programmatic access
- Auth is configured per client instance in the constructor

#### Resource ID Resolution
The cc-api client includes automatic ID resolution and caching:
- Automatically resolves owner IDs for apps, addons, OAuth consumers
- Translates between different addon ID formats
- Configurable storage backends (memory, file, localStorage)

#### Command Pattern
All API operations use the Command pattern:
```javascript
const command = new GetApplicationCommand({ applicationId: 'app_123' });
const result = await client.send(command);
```

#### Streaming
Real-time data via Server-Sent Events:
- Application logs, access logs, platform events
- Auto-retry with exponential backoff
- Health checks and connection monitoring

### File Organization
- `src/clients/{client}/commands/{domain}/` - Command implementations
- `src/clients/{client}/lib/` - Client-specific utilities  
- `src/lib/` - Shared base functionality
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions
- `test/unit/` - Unit tests
- `test/e2e/` - End-to-end tests
- `test/lib/mock-api/` - Mock API server for testing
- `esm/` - Legacy functional client
- `tasks/` - Build and analysis scripts

### Testing Environment
- **Unit tests**: Mocha (Node.js) + Web Test Runner (browser)
- **E2E tests**: Both browser and Node.js environments
- **Mock API**: Custom mock server for testing API interactions
- Tests are located parallel to source files with `.spec.js` extension

### Build System
- **Rollup**: Bundling and distribution
- **TypeScript**: Type checking (JSDoc + .d.ts files)
- **ESLint**: Code linting with Prettier integration
- Supports both Node.js (22+) and browser environments

### Export Strategy
The package uses conditional exports in package.json:
- Modern clients: Direct imports from `/src`
- Legacy client: From `/esm`
- Storage providers: Environment-specific (browser/node)
- TypeScript definitions: Generated to `/dist/types`