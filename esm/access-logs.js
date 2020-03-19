import Emitter from 'component-emitter';
import { ONE_HOUR_MICROS, ONE_SECOND_MICROS, toMicroIsoString, toMicroTimestamp } from './utils/date.js';

// "from" and "to" are timestamps in microseconds
function getAccessLogsFromWarp10 ({ appId, realAddonId, from, to, warpToken }) {

  const [granularity, id] = (realAddonId != null)
    ? ['addon_id', realAddonId]
    : ['app_id', appId];

  const fromDate = toMicroIsoString(from);
  const toDate = toMicroIsoString(to);
  const body = `[ '${warpToken}' 'accessLogs' { '${granularity}' '${id}' } '${fromDate}' '${toDate}' ] FETCH MERGE SORT VALUES`;

  const responseHandler = (data) => data.flat(2).map((x) => JSON.parse(x));

  return Promise.resolve({ body, responseHandler });
}

// "from" and "to" are timestamps in microseconds
export function getAccessLogsFromWarp10InBatches ({ appId, realAddonId, from, to, warpToken }, sendToWarp10) {

  const emitter = new Emitter();

  function doCall (batchFrom) {

    const batchFromPlusOneHour = batchFrom + ONE_HOUR_MICROS;
    // Make sure we don't fetch after "to"
    const [batchTo, shouldContinue] = (batchFromPlusOneHour < to)
      ? [batchFromPlusOneHour, true]
      : [to, false];

    getAccessLogsFromWarp10({ appId, realAddonId, from: batchFrom, to: batchTo, warpToken })
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
// 4. Schedule next loop 1 second later with fetch from="last log ts or first ts" to="now"
export function getContinuousAccessLogsFromWarp10 ({ appId, realAddonId, warpToken }, sendToWarp10) {

  const emitter = new Emitter();

  // Store last log between loops
  let lastLog;

  // "from" and "to" are timestamps in microseconds
  function doCall (from, to) {

    getAccessLogsFromWarp10({ appId, realAddonId, from, to, warpToken })
      .then(sendToWarp10)
      .then((data) => {
        emitter.emit('data', data);

        lastLog = data.slice(-1)[0] || lastLog;

        // From "last log TS + 1µs" to NOW
        const batchFrom = (lastLog != null) ? toMicroTimestamp(lastLog.t) + 1 : from;
        const batchTo = toMicroTimestamp();

        // Prevent huge recursive call stack
        setTimeout(() => doCall(batchFrom, batchTo), 1000);
      })
      .catch((e) => emitter.emit('error', e));
  }

  // Trigger batch "loop" mechanism
  const now = toMicroTimestamp();
  doCall(now - 10 * ONE_SECOND_MICROS, now);

  return emitter;
}
