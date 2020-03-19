export const ONE_HOUR_MICROS = 60 * 60 * 1000 * 1000;
export const ONE_SECOND_MICROS = 1000 * 1000;

export function toMicroIsoString (microTimestamp) {
  const milliTimestamp = Math.floor(microTimestamp / 1000);
  const milliIsoString = new Date(milliTimestamp).toISOString();
  const microSuffix = String(microTimestamp % 1000).padStart(3, '0');
  return milliIsoString.replace(/Z$/, `${microSuffix}Z`);
}

export function toMicroTimestamp (isoString) {
  if (isoString == null) {
    return Date.now() * 1000;
  }
  const milliTimestamp = (new Date(isoString)).getTime();
  const [, microSuffix = '000'] = isoString.match(/\.\d{3}(\d{3})?Z$/);
  const microseconds = Number(microSuffix);
  return milliTimestamp * 1000 + microseconds;
}
