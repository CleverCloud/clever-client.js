import Emitter from 'component-emitter';
import { asWarp10Timespan, ONE_HOUR, toTimestamp } from './utils/date.js';

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

export function getContinousAccessLogsFromWarp10 ({ appId, realAddonId, warpToken }, sendToWarp10) {

  const emitter = new Emitter();

  function doCall (from) {

    const to = Date.now();
    const timespan = asWarp10Timespan(from, to);
    // Used to compute batch running time
    const beforeCall = Date.now();

    getAccessLogsFromWarp10({ appId, realAddonId, timespan, warpToken })
      .then(sendToWarp10)
      .then((data) => {
        emitter.emit('data', data);
        const lastLog = data.slice(-1)[0];
        const last = (lastLog != null) ? toTimestamp(lastLog.t) : from;

        const diff = Date.now() - beforeCall;
        const timeout = (diff < 1000) ? 1000 - diff : 0;

        // Prevent huge recursive call stack
        setTimeout(() => doCall(last), timeout);
      })
      .catch((e) => emitter.emit('error', e));
  }

  // Trigger batch "loop" mechanism
  doCall(Date.now() - 10 * 1000);

  return emitter;
}
