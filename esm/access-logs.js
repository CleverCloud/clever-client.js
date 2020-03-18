import Emitter from 'component-emitter';
import { asWarp10Timespan, ONE_HOUR } from './utils/date.js';

function getAccessLogsFromWarp10 ({ appId, realAddonId, timespan, warpToken }) {

  const [granularity, id] = (realAddonId != null)
    ? ['addon_id', realAddonId]
    : ['app_id', appId];

  const body = `[ '${warpToken}' 'accessLogs' { '${granularity}' '${id}' } ${timespan} ] FETCH MERGE SORT VALUES`;
  const responseHandler = (data) => data.flat(2).map((x) => JSON.parse(x));

  return Promise.resolve({ body, responseHandler });
}

export function getAccessLogsFromWarp10InBatches ({ appId, realAddonId, from, to, warpToken }, sendToWarp10) {

  const emitter = new Emitter();

  function doCall (batchFrom) {

    const batchFromPlusOneHour = batchFrom + ONE_HOUR;
    // Make sure we don't fetch after "to"
    const [batchTo, shouldContinue] = (batchFromPlusOneHour < to)
      ? [batchFromPlusOneHour, true]
      : [to, false];
    const timespan = asWarp10Timespan(batchFrom, batchTo);

    getAccessLogsFromWarp10({ appId, realAddonId, timespan, warpToken })
      .then(sendToWarp10)
      .then((data) => {
        emitter.emit('data', data);
        if (shouldContinue) {
          // Prevent huge recursive call stack
          setTimeout(() => doCall(batchTo), 0);
        }
      })
      .catch((e) => emitter.emit('error', e));
  }

  // Trigger batch "loop" mechanism
  doCall(from);

  return emitter;
}

// Here's how it works
// 1. Start loop with fetch from="10 seconds ago" to="now"
// 2. Wait for data...
// 3. Data arrives
// 4. Schedule next loop in 1000ms later with fetch from="last to + 1ms" to="now"
// The from/to timeframe will be around (fetch roundtrip) + 1000ms
export function getContinuousAccessLogsFromWarp10 ({ appId, realAddonId, warpToken }, sendToWarp10) {

  const emitter = new Emitter();

  function doCall (from, to) {

    const timespan = asWarp10Timespan(from, to);
    getAccessLogsFromWarp10({ appId, realAddonId, timespan, warpToken })
      .then(sendToWarp10)
      .then((data) => {
        emitter.emit('data', data);
        // Prevent huge recursive call stack
        setTimeout(() => doCall(to + 1, Date.now()), 1000);
      })
      .catch((e) => emitter.emit('error', e));
  }

  // Trigger batch "loop" mechanism
  const now = Date.now();
  doCall(now - 10 * 1000, now);

  return emitter;
}
