import type { Composer } from '../../../../types/command.types.js';
import { tolerateNotFound } from '../../../../utils/error-utils.ts';
import { isTimeoutError, Polling } from '../../../../utils/polling.js';
import type { ApplicationOrAddonId, CcApiType } from '../../types/cc-api.types.js';
import { GetLogDrainCommand } from './get-log-drain-command.js';
import type { LogDrain, LogDrainStatus } from './log-drain.types.js';

const POLLING_TIMEOUT_MS = 30_000;
const POLLING_INTERVAL_MS = 1000;

/**
 * Wait for a log drain to reach ENABLED state
 */
export async function waitForLogDrainEnabled(
  composer: Composer<CcApiType>,
  resource: ApplicationOrAddonId,
  drainId: string,
): Promise<LogDrain> {
  return waitForState(() => composer.send(new GetLogDrainCommand({ ...resource, drainId })), 'ENABLED', 'enabled');
}

/**
 * Wait for a log drain to reach DISABLED state
 */
export async function waitForLogDrainDisabled(
  composer: Composer<CcApiType>,
  resource: ApplicationOrAddonId,
  drainId: string,
): Promise<LogDrain> {
  return waitForState(() => composer.send(new GetLogDrainCommand({ ...resource, drainId })), 'DISABLED', 'disabled');
}

/**
 * Wait for a log drain (fetched via `fetchDrain`) to reach a specific state
 */
async function waitForState<T extends { status: LogDrainStatus }>(
  fetchDrain: () => Promise<T | null>,
  targetState: LogDrainStatus,
  stateLabel: string,
): Promise<T> {
  const polling = new Polling(
    async () => {
      const result = await tolerateNotFound(fetchDrain());
      if (result == null) {
        return { stop: false };
      }
      if (result.status === targetState) {
        return { stop: true, value: result };
      }
      return { stop: false };
    },
    POLLING_INTERVAL_MS,
    POLLING_TIMEOUT_MS,
  );

  try {
    return await polling.start();
  } catch (e) {
    if (isTimeoutError(e)) {
      throw new Error(`Log drain state change has been requested but is not ${stateLabel} yet`);
    } else {
      throw e;
    }
  }
}
