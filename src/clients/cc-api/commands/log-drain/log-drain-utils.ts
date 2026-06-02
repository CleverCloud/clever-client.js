import type { Composer } from '../../../../types/command.types.js';
import { isTimeoutError, Polling } from '../../../../utils/polling.js';
import type { CcApiType } from '../../types/cc-api.types.js';
import { GetLogDrainCommand } from './get-log-drain-command.js';
import type { LogDrain } from './log-drain.types.js';

const POLLING_TIMEOUT_MS = 30_000;
const POLLING_INTERVAL_MS = 1000;

/**
 * Wait for a log drain to reach ENABLED state
 */
export async function waitForLogDrainEnabled(
  composer: Composer<CcApiType>,
  ownerId: string,
  applicationId: string,
  drainId: string,
): Promise<LogDrain> {
  return waitForState(composer, ownerId, applicationId, drainId, 'ENABLED', 'enabled');
}

/**
 * Wait for a log drain to reach DISABLED state
 */
export async function waitForLogDrainDisabled(
  composer: Composer<CcApiType>,
  ownerId: string,
  applicationId: string,
  drainId: string,
): Promise<LogDrain> {
  return waitForState(composer, ownerId, applicationId, drainId, 'DISABLED', 'disabled');
}

/**
 * Wait for a log drain to reach a specific state
 */
async function waitForState(
  composer: Composer<CcApiType>,
  ownerId: string,
  applicationId: string,
  drainId: string,
  targetState: string,
  stateLabel: string,
): Promise<LogDrain> {
  const polling = new Polling(
    async () => {
      const result = await composer.send(new GetLogDrainCommand({ ownerId, applicationId, drainId }));
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
