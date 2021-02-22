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
export function getContinuousAccessLogsFromWarp10 ({ appId, realAddonId, warpToken, delay = 0 }, sendToWarp10) {

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
        const batchTo = toMicroTimestamp() - delay;

        // Prevent huge recursive call stack
        setTimeout(() => doCall(batchFrom, batchTo), 1000);
      })
      .catch((e) => emitter.emit('error', e));
  }

  // Trigger batch "loop" mechanism
  const now = toMicroTimestamp() - delay;
  doCall(now - 10 * ONE_SECOND_MICROS, now);

  return emitter;
}

export function getStatusCodesFromWarp10 ({ warpToken, ownerId, appId }) {

  const [granularity, id] = getGranularity(ownerId, appId);
  const warpscript = `'${warpToken}' '${granularity}' '${id}' NOW 24 h @clevercloud/accessLogs_status_code_v1`;

  return Promise.resolve({
    method: 'post',
    url: '/api/v0/exec',
    body: warpscript,
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: { __: getSlug('statuscodes', ownerId, appId) },
    responseHandler ([results]) {
      // Remove status codes "-1" YOLO
      delete results['-1'];
      return results;
    },
  });
}

export function getRequestsFromWarp10 ({ warpToken, ownerId, appId }) {

  const ONE_HOUR = 1000 * 60 * 60;

  const now = new Date();
  const nowTs = now.getTime();
  const nowRoundedTs = nowTs - nowTs % ONE_HOUR;
  const endDateMicroSecs = new Date(nowRoundedTs).getTime() * 1000;

  const [granularity, id] = getGranularity(ownerId, appId);
  const warpscript = `'${warpToken}' '${granularity}' '${id}' ${endDateMicroSecs} 24 h 1 h @clevercloud/accessLogs_request_count_v1`;

  return Promise.resolve({
    method: 'post',
    url: '/api/v0/exec',
    body: warpscript,
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: { __: getSlug('requests', ownerId, appId) },
    responseHandler ([results]) {
      // Convert timestamps in ms
      return results
        .map(([from, to, count]) => [Math.floor(from / 1000), Math.floor(to / 1000), count]);
    },
  });
}

export function getAccessLogsHeatmapFromWarp10 ({ warpToken, ownerId, appId }) {

  const [granularity, id] = getGranularity(ownerId, appId);
  const warpscript = `'${warpToken}' '${granularity}' '${id}' 24 @clevercloud/logs_heatmap_v1`;

  return Promise.resolve({
    method: 'post',
    url: '/api/v0/exec',
    body: warpscript,
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: { __: getSlug('heatmap', ownerId, appId) },
    responseHandler ([results]) {
      return Object.entries(results)
        .filter(([jsonData]) => jsonData !== '[NaN,NaN]')
        .map(([jsonData, count]) => {
          const [lat, lon] = JSON.parse(jsonData);
          return { lat, lon, count };
        });
    },
  });
}

// "from" and "to" are timestamps in microseconds
export function getAccessLogsDotmapFromWarp10 ({ warpToken, ownerId, appId, from, to }) {

  const [granularity, id] = getGranularity(ownerId, appId);
  const fromDate = toMicroIsoString(from);
  const toDate = toMicroIsoString(to);
  const warpscript = `'${warpToken}' '${granularity}' '${id}' '${fromDate}' '${toDate}' @clevercloud/logs_dotmap_v1`;

  return Promise.resolve({
    method: 'post',
    url: '/api/v0/exec',
    body: warpscript,
    // This is ignored by Warp10, it's here to help identify HTTP calls in browser devtools
    queryParams: { __: getSlug('dotmap', ownerId, appId) },
    responseHandler ([results]) {
      return Object.entries(results).map(([jsonData, count]) => {
        const [lat, lon, country, city] = JSON.parse(jsonData);
        return { lat, lon, country, city, count };
      });
    },
  });
}

function getGranularity (ownerId, appId) {
  return (appId != null)
    ? ['app_id', appId]
    : ['owner_id', ownerId];
}

function getSlug (prefix, ...items) {
  const shortItems = items
    .filter((a) => a != null)
    .map((a) => a.slice(0, 10));
  return [prefix, ...shortItems].join('__');
}
