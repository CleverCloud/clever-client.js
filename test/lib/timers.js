let timersArePatched = false;

const globalSetTimeout = globalThis.setTimeout;
const globalClearTimeout = globalThis.clearTimeout;
const globalSetInterval = globalThis.setInterval;
const globalClearInterval = globalThis.clearInterval;

/** @type {Map<NodeJS.Timeout|number|string, string>} */
const timeoutIds = new Map();
/** @type {Set<NodeJS.Timeout|number|string>} */
const intervalIds = new Set();

/**
 * @param {number} delay
 * @returns {Promise<void>}
 */
export function sleep(delay) {
  return new Promise((resolve) => {
    globalSetTimeout(resolve, delay);
  });
}

export function patchTimers() {
  if (timersArePatched) {
    return;
  }

  timersArePatched = true;

  timeoutIds.clear();
  intervalIds.clear();

  // @ts-ignore
  globalThis.setTimeout = (callback, delay) => {
    // Not sure why but some tests had a residual setTimeout of one second at the end
    // We can ignore those
    if (isCallInsidePath('node:internal/deps/undici')) {
      return globalSetTimeout(callback, delay);
    }

    const id = globalSetTimeout(() => {
      timeoutIds.delete(id);
      return callback();
    }, delay);
    timeoutIds.set(id, callback.toString());
    return id;
  };

  globalThis.clearTimeout = (id) => {
    timeoutIds.delete(id);
    return globalClearTimeout(id);
  };

  // @ts-ignore
  globalThis.setInterval = (callback, delay) => {
    const id = globalSetInterval(() => {
      return callback();
    }, delay);
    intervalIds.add(id);
    return id;
  };

  globalThis.clearInterval = (id) => {
    intervalIds.delete(id);
    return globalClearInterval(id);
  };
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function isCallInsidePath(path) {
  const err = new Error();
  const stackLines = err.stack.split('\n');
  return stackLines.some((line) => line.includes(path));
}

export function clearTimers() {
  if (!timersArePatched) {
    return;
  }

  const timeoutsCount = timeoutIds.size;
  const intervalsCount = intervalIds.size;

  if (timeoutsCount > 0 || intervalsCount > 0) {
    for (const id of timeoutIds) {
      // @ts-ignore
      globalClearTimeout(id);
    }
    timeoutIds.clear();

    for (const id of intervalIds) {
      globalClearInterval(id);
    }
    intervalIds.clear();

    throw new Error(
      `Some timers were not cleared properly (timeouts: ${timeoutsCount} / intervals: ${intervalsCount})`,
    );
  }
}

export function unpatchTimers() {
  if (!timersArePatched) {
    return;
  }

  timersArePatched = false;

  globalThis.setTimeout = globalSetTimeout;
  globalThis.clearTimeout = globalClearTimeout;
  globalThis.setInterval = globalSetInterval;
  globalThis.clearInterval = globalClearInterval;
}
