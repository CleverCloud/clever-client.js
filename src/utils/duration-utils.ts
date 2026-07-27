/**
 * The ISO 8601 duration grammar `java.time.Duration` accepts, which is the one the API speaks wherever a
 * duration is a time span rather than a calendar span. Every component is optional, so a match still has to
 * be checked for carrying at least one of them.
 */
const ISO_DURATION_PATTERN =
  /^([+-])?P(?:([+-]?\d+)D)?(?:T(?:([+-]?\d+)H)?(?:([+-]?\d+)M)?(?:([+-]?\d+(?:[.,]\d{1,9})?)S)?)?$/i;

/**
 * Parses an ISO 8601 duration into a number of milliseconds.
 *
 * The grammar is `PnDTnHnMnS`, where days count as exactly 24 hours, a sign is allowed both on the whole
 * duration and on each component, and the seconds may carry up to nine fractional digits. Weeks, months and
 * years are rejected: they have no fixed length, and the API models them as calendar periods rather than as
 * durations.
 *
 * @param duration - The ISO 8601 duration to parse
 * @returns The duration in milliseconds
 * @throws {Error} If the input cannot be parsed as an ISO 8601 duration
 *
 * @example
 * parseDuration('PT1H')        // 3600000
 * parseDuration('P1DT2H30M')   // 95400000
 * parseDuration('PT0.5S')      // 500
 * parseDuration('-PT1H')       // -3600000
 */
export function parseDuration(duration: string): number {
  const match = typeof duration === 'string' ? ISO_DURATION_PATTERN.exec(duration) : null;
  const [, sign, days, hours, minutes, seconds] = match ?? [];

  // every component is optional in the pattern, which leaves the empty forms 'P' and 'PT' matching although
  // they carry no duration at all
  if (match == null || (days == null && hours == null && minutes == null && seconds == null)) {
    throw new Error(`Invalid duration: ${String(duration)}`);
  }

  const milliseconds =
    toDurationPart(days) * 86_400_000 +
    toDurationPart(hours) * 3_600_000 +
    toDurationPart(minutes) * 60_000 +
    toDurationPart(seconds) * 1_000;

  return Math.round(sign === '-' ? -milliseconds : milliseconds);
}

/**
 * Normalizes a duration into the ISO 8601 form the API expects on the wire.
 *
 * This is the duration counterpart of `normalizeDate`: it lets a duration input accept a plain number of
 * milliseconds, the way date inputs accept a timestamp. A string is assumed to be an ISO 8601 duration
 * already and is passed through untouched, because the endpoints do not all read the same grammar — some
 * take a time span (`PT1H`), others also accept a calendar period (`P1M`) — and rewriting the caller's value
 * could turn one the API accepts into one it rejects.
 *
 * @param duration - The duration to normalize, either a number of milliseconds or an ISO 8601 duration
 * @returns The duration as an ISO 8601 string, or null if input is null/undefined
 * @throws {Error} If the input is a number that cannot be turned into a duration
 *
 * @example
 * normalizeDuration(3600000)   // 'PT1H'
 * normalizeDuration(90500)     // 'PT1M30.5S'
 * normalizeDuration(0)         // 'PT0S'
 * normalizeDuration('P1M')     // 'P1M'
 */
export function normalizeDuration(duration: number | string | null | undefined): string | null {
  if (duration == null) {
    return null;
  }

  if (typeof duration !== 'number') {
    return duration;
  }

  if (!Number.isFinite(duration)) {
    throw new Error(`Invalid duration: ${String(duration)}`);
  }

  // days are deliberately left out: rendering everything in hours is what `java.time.Duration` itself
  // produces, and it keeps the value in the `PT` form every endpoint reads as a time span
  const totalMilliseconds = Math.round(Math.abs(duration));
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const seconds = (totalMilliseconds % 60_000) / 1_000;

  let isoDuration = 'PT';
  if (hours !== 0) {
    isoDuration += `${hours}H`;
  }
  if (minutes !== 0) {
    isoDuration += `${minutes}M`;
  }
  if (seconds !== 0 || isoDuration === 'PT') {
    isoDuration += `${seconds}S`;
  }

  return duration < 0 ? `-${isoDuration}` : isoDuration;
}

/**
 * Reads one component of an ISO 8601 duration as a number, counting an absent component as zero.
 * The fractional separator may be a comma, which JavaScript does not accept.
 *
 * @param value - The raw component, as captured by `ISO_DURATION_PATTERN`
 * @returns The component value
 */
function toDurationPart(value: string | undefined): number {
  return value == null ? 0 : Number(value.replace(',', '.'));
}
