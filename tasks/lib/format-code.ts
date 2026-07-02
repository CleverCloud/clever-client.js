import { join as pathJoin } from 'path';
import type { Options } from 'prettier';
import { format, resolveConfig } from 'prettier';

export async function formatJsCode(rawContents: string): Promise<string> {
  return await format(rawContents, { ...(await getOptions()), parser: 'babel' });
}

export async function formatTsCode(rawContents: string): Promise<string> {
  return await format(rawContents, { ...(await getOptions()), parser: 'typescript' });
}

let options: Options;
async function getOptions(): Promise<Options> {
  if (options == null) {
    options = (await resolveConfig(pathJoin('./.prettierrc'))) ?? {};
  }
  return options;
}
