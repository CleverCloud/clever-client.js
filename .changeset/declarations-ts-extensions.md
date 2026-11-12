---
'@clevercloud/client': patch
---

The type declarations now require TypeScript 5.0 or later

They import each other with the `.ts` extension, which TypeScript resolves to the `.d.ts` files since 5.0.
With an older TypeScript, the imports of `@clevercloud/client` fail to resolve with `TS2691`, or lose their types with `skipLibCheck`.
