import fs from 'fs-extra';
import path from 'node:path';
// todo: remove that when we use a version of Node.js >= 23.5.0 (we can ignore because the feature was backported to version 22.13.0)
import { styleText } from 'node:util';
import { SOURCES, WORKING_DIR } from './lib/config.ts';
import { compareEndpoints, generateJsonReport, generateMarkdownReport } from './lib/endpoint-compare.ts';
import { parseEndpoints } from './lib/endpoint-parse.ts';
import type { AnalyzedOpenapi, Endpoint, EndpointsSource } from './lib/endpoint.types.ts';
import { confirm } from './lib/prompt.ts';
import { getSourceFileObject } from './lib/source-get.ts';

const NOW = new Date().toISOString();
const OUTPUT_DIR = path.join(WORKING_DIR, `./analyze`);

function getDiffReportPath(type: 'md' | 'json'): string {
  return path.join(OUTPUT_DIR, `./diff-report.${type}`);
}

function getVersionedFilePath(source: EndpointsSource): string {
  return path.join(OUTPUT_DIR, `./${source.id}.json`);
}

async function storeVersioned(
  source: EndpointsSource,
  versionedOpenapi: object,
  filePath: string,
  backup?: string,
): Promise<void> {
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

async function run(): Promise<void> {
  console.log(styleText(['bold', 'underline'], 'Analysing...'));

  const analyzedSources: Array<AnalyzedOpenapi> = [];

  for (const source of SOURCES) {
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

    const analyzedOpenapi: AnalyzedOpenapi = {
      versionedOpenapi: { source, date: NOW, openapi },
      endpoints,
      diff: { hasDiff: false },
    };

    analyzedSources.push(analyzedOpenapi);

    // get previous version
    console.log(styleText('gray', `Comparing with last version...`));

    let previousEndpoints: Record<string, Endpoint> = {};
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
      const diffStrings: Array<string> = [];
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
