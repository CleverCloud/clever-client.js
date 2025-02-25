import { sortAndGroupByCall, streamToString } from './lib.mjs';

const input = await streamToString(process.stdin);
const apiCalls = JSON.parse(input);

console.log(`# Analysis of @clevercloud/client usage`);
console.log('');

const apiCallsGroupedAndSorted = sortAndGroupByCall(apiCalls);

console.log(`* Number of API calls: ${Object.values(apiCallsGroupedAndSorted).length}`);
console.log('');

console.log('## Details');
console.log('');

for (const groupedCalls of apiCallsGroupedAndSorted) {
  const { method, path } = groupedCalls[0];
  console.log(`* \`${method.toUpperCase().padEnd(6, ' ')} ${path}\`:`);
  for (const { filepath, line } of groupedCalls) {
    console.log(`  * \`${filepath}:${line}\``);
  }
}
