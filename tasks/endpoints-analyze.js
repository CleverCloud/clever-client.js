/**
 * @import { AnalyzedOpenapi, EndpointsSource, Endpoint } from './lib/endpoint.types.js'
 */
import fs from 'fs-extra';
import path from 'node:path';
// todo: remove that when we use a version of Node.js >= 23.5.0 (we can ignore because the feature was backported to version 22.13.0)
import { styleText } from 'node:util';
import { SOURCES, WORKING_DIR } from './lib/config.js';
import { compareEndpoints, generateJsonReport, generateMarkdownReport } from './lib/endpoint-compare.js';
import { parseEndpoints } from './lib/endpoint-parse.js';
import { confirm } from './lib/prompt.js';
import { getSourceFileObject } from './lib/source-get.js';

const NOW = new Date().toISOString();
const OUTPUT_DIR = path.join(WORKING_DIR, `./analyze`);

/**
 * @param {'md'|'json'} type
 * @returns {string}
 */
function getDiffReportPath(type) {
  return path.join(OUTPUT_DIR, `./diff-report.${type}`);
}

/**
 * @param {EndpointsSource} source
 * @returns {string}
 */
function getVersionedFilePath(source) {
  return path.join(OUTPUT_DIR, `./${source.id}.json`);
}

/**
 * @param {EndpointsSource} source
 * @param {object} versionedOpenapi
 * @param {string} filePath
 * @param {string} [backup]
 * @returns {Promise<void>}
 */
async function storeVersioned(source, versionedOpenapi, filePath, backup) {
  if (backup != null && (await fs.pathExists(filePath))) {
    const backupPath = path.join(OUTPUT_DIR, `./backup/${source.id}.${backup}.json`);
    console.log(styleText('gray', `Copying ${filePath} to ${backupPath} ...`));
    fs.copySync(filePath, backupPath);
    console.log(styleText('gray', `> ok`));
  }

  console.log(styleText('gray', `Saving to ${filePath} ...`));
  fs.outputJsonSync(filePath, versionedOpenapi, { spaces: 2 });
  console.log(styleText('gray', `> ok`));
}

// todo: add param for
//  - no interactive and generate report in md or json (or both)
//  - no save

async function run() {
  console.log(styleText(['bold', 'underline'], 'Analysing...'));

  /** @type {Array<AnalyzedOpenapi>} */
  const analyzedSources = [];

  for (let source of SOURCES) {
    console.log(`${styleText('blue', `▶ Processing source ${source.id}...`)}`);

    // fetch source
    console.log(styleText('gray', `Fetching openapi...`));
    const openapi = await getSourceFileObject(source);
    console.log(styleText('gray', `> ok`));

    // parse and extract endpoints from it
    console.log(styleText('gray', `Parsing openapi...`));
    const endpoints = await parseEndpoints(openapi, source.pathPrefix);
    console.log(styleText('gray', `> ok`));

    // versioned output path
    const versionedFilePath = getVersionedFilePath(source);

    /** @type {AnalyzedOpenapi} */
    const analyzedOpenapi = {
      versionedOpenapi: { source, date: NOW, openapi },
      endpoints,
      diff: { hasDiff: false },
    };

    analyzedSources.push(analyzedOpenapi);

    // get previous version
    console.log(styleText('gray', `Comparing with last version...`));

    /** @type {Record<string, Endpoint>} */
    let previousEndpoints = {};
    if (!(await fs.pathExists(versionedFilePath))) {
      console.log(`${styleText('gray', '> First time I see this openapi')}`);
    } else {
      const previousVersion = await fs.readJson(versionedFilePath);
      previousEndpoints = await parseEndpoints(previousVersion.openapi, previousVersion.source.pathPrefix);

      analyzedOpenapi.previous = {
        versionedOpenapi: previousVersion,
        endpoints: previousEndpoints,
      };
    }

    // compare
    analyzedOpenapi.diff = compareEndpoints(source, previousEndpoints, endpoints);

    // log diff
    const diff = analyzedOpenapi.diff;
    if (!diff.hasDiff) {
      console.log(`${styleText('green', '✔ No Diff found')}`);
    } else {
      const diffStrings = [];
      if (diff.addedEndpoints?.length > 0) {
        diffStrings.push(styleText('green', `+${diff.addedEndpoints.length}`));
      }
      if (diff.deletedEndpoints?.length > 0) {
        diffStrings.push(styleText('red', `-${diff.deletedEndpoints.length}`));
      }
      if (diff.modifiedEndpoints?.length > 0) {
        diffStrings.push(styleText('blue', `~${diff.modifiedEndpoints.length}`));
      }

      console.log(`${styleText('yellow', '! Diff found:')} ${diffStrings.join(' ')}`);
    }
    console.log();
  }

  const withDiffs = analyzedSources.filter((c) => c.diff.hasDiff);

  if (withDiffs.length > 0) {
    console.log(styleText(['bold', 'underline'], 'Generating diff reports...'));

    console.log(styleText('gray', `[Markdown] Generating report...`));
    const mdReport = generateMarkdownReport(NOW, analyzedSources);
    const mdReportPath = getDiffReportPath('md');
    console.log(styleText('gray', `[Markdown] Writing report to ${mdReportPath}...`));
    fs.outputFileSync(mdReportPath, mdReport);
    console.log(styleText('gray', `> ok`));

    console.log(styleText('gray', `[JSON]     Generating report...`));
    const jsonReport = generateJsonReport(NOW, analyzedSources);
    const jsonReportPath = getDiffReportPath('json');
    console.log(styleText('gray', `[JSON]     Writing report to ${jsonReportPath}...`));
    fs.outputFileSync(jsonReportPath, jsonReport);
    console.log(styleText('gray', `> ok`));

    console.log();
    if (await confirm('Would you like to save versioned openapi', false)) {
      console.log(styleText(['bold', 'underline'], 'Saving files...'));

      await Promise.allSettled(
        analyzedSources.map((analyzedOpenapi) => {
          const source = analyzedOpenapi.versionedOpenapi.source;
          const versionedFilePath = getVersionedFilePath(analyzedOpenapi.versionedOpenapi.source);
          if (analyzedOpenapi.previous == null) {
            return storeVersioned(source, analyzedOpenapi.versionedOpenapi, versionedFilePath);
          } else {
            return storeVersioned(
              source,
              analyzedOpenapi.versionedOpenapi,
              versionedFilePath,
              analyzedOpenapi.previous.versionedOpenapi.date,
            );
          }
        }),
      );
    }
  } else {
    console.log(`${styleText(['bold', 'green'], `✔ No diff found`)}`);
  }
}

console.log(styleText(['bold', 'underline', 'italic'], 'Endpoints analysis'));
console.log('-> This tool takes all endpoints and generate a diff report');
console.log("-> There is no automatic things, it's up to you to choose what to do with this report");
console.log('-------------------------------------------------------------------------------------');

if (await confirm('Do you want to continue')) {
  console.log();
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
