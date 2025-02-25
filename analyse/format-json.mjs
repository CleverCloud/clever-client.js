import { sortAndGroupByCall, streamToString } from './lib.mjs';

const input = await streamToString(process.stdin);
const apiCalls = JSON.parse(input);

const apiCallsGroupedAndSorted = sortAndGroupByCall(apiCalls);

const result = {};

for (const groupedCalls of apiCallsGroupedAndSorted) {
  const { method, path } = groupedCalls[0];
  const key = `${method.toUpperCase().padEnd(6, ' ')} ${path}`;
  result[key] = groupedCalls.map((call) => `${call.filepath}:${call.line}`);
}

console.log(JSON.stringify(result));
