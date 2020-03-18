export const ONE_HOUR = 60 * 60 * 1000;

export function toTimestamp (date) {
  return (new Date(date)).getTime();
}

export function asWarp10Timespan (from, to) {
  return `'${(new Date(from)).toISOString()}' '${(new Date(to)).toISOString()}'`;
}
