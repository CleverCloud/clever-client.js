# clever-client

JavaScript client for Clever-Cloud API.

## How to build

First you need to install the npm dependencies:

```sh
npm install
```

Then you need to run the npm script `build` and provide the API endpoint you want to use:

```sh
API_BASE_URL="https://api.clever-cloud.com/v2" npm run build
```

This will build a two bundles (non-minified and minified) in `dist`: `clever-client.js` and `clever-client.min.js`.
Those bundles can be used with node.js or in a browser environment.

## How to release

Once you've built a client, you can create a release and publish it on [npmjs.com](https://www.npmjs.com/clever-client). 

To create a new release, you need to update `package.json` and `package-lock.json` with the new version, create a commit and add a git tag.
This can be done with this command:

```sh
npm version minor
```

NOTE: Most of the time, you need to update the client because the API changed. For this kind of cases a minor update will be OK. If a minor update is not what you're looking for, you can check the other options of [npm version](https://docs.npmjs.com/cli/version). 

After this step, you're ready to publish this new version:

```sh
npm publish
```

## How to build for preprod and test it locally without publishing

If you're working with a new (or modified) API that is only available on the preprod env, you need a way to generate a client for this version and use it locally in your projects.

To do this, you need to run the `build` script with the preprod endpoint:

```sh
API_BASE_URL="https://ccapi-preprod.cleverapps.io/v2" npm run build
```

Then, you need to generate a local package:

```sh
npm pack
```

This will generate a local archive named `clever-client-X.Y.Z.tgz`.
You can use this archive in your local projects to try and test the new (or modified) APIs.

If your project uses npm, you'll have to do this:

```sh
npm install path/to/clever-client-X.Y.Z.tgz
```

This will override the version specified in the `package.json`.

If your project uses yarn, you'll have to do this:

```sh
yarn cache clean clever-client
yarn add -f path/to/clever-client-X.Y.Z.tgz
```
