/**
 * @import { Options } from 'prettier'
 */
import { join as pathJoin } from 'path';
import { format, resolveConfig } from 'prettier';

/**
 * @param {string} rawContents
 * @returns {Promise<string>}
 */
export async function formatJsCode(rawContents) {
  return await format(rawContents, { ...(await getOptions()), parser: 'babel' });
}

/**
 * @param {string} rawContents
 * @returns {Promise<string>}
 */
export async function formatTsCode(rawContents) {
  return await format(rawContents, { ...(await getOptions()), parser: 'typescript' });
}

/** @type {Options} */
let options;
async function getOptions() {
  if (options == null) {
    options = await resolveConfig(pathJoin('./.prettierrc'));
  }
  return options;
}
