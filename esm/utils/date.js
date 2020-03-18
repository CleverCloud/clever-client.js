export const ONE_HOUR = 60 * 60 * 1000;

export function toTimestamp (date) {
  return (new Date(date)).getTime();
}

function toISOStringWithMicrosecondPrecision (microseconds) {
  const milliseconds = Math.floor(microseconds / 1000);
  const isoStringMilli = new Date(milliseconds).toISOString();
  const microPrecisionString = String(microseconds % 1000).padStart(3, '0');
  return isoStringMilli.replace(/Z$/, `${microPrecisionString}Z`);
}

// Converts "from" and "to" ms timestamps to ISO 8601 with µs precision
// also removes 1µs to "to" because Warp10 timespan are inclusive
export function asWarp10Timespan (fromMilli, toMilli) {
  const fromMicro = fromMilli * 1000;
  const toMicro = (toMilli * 1000) - 1;
  return `'${toISOStringWithMicrosecondPrecision(fromMicro)}' '${toISOStringWithMicrosecondPrecision(toMicro)}'`;
}
