import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import type { CcRequestParams } from '../../../../types/request.types.js';
import type { SelfOrPromise } from '../../../../types/utils.types.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { IdResolve } from '../../types/resource-id-resolver.types.js';
import type {
  GetLogDrainTestCommandCommandInput,
  GetLogDrainTestCommandCommandOutput,
} from './get-log-drain-test-command-command.types.js';

/**
 * Retrieves a ready-to-run shell command that ships a sample payload to a log drain's recipient, so the
 * recipient can be tested by hand from a terminal.
 *
 * The command is returned as a plain-text string; nothing about the drain is changed.
 *
 * @endpoint [GET] /v4/drains/organisations/:XXX/resources/:XXX/drains/:XXX/test-command
 * @group LogDrain
 * @version 4
 */
export class GetLogDrainTestCommandCommand extends CcApiSimpleCommand<
  GetLogDrainTestCommandCommandInput,
  GetLogDrainTestCommandCommandOutput
> {
  toRequestParams(params: GetLogDrainTestCommandCommandInput): Partial<CcRequestParams> {
    const resourceId = 'applicationId' in params ? params.applicationId : params.addonId;

    return {
      method: 'GET',
      url: safeUrl`/v4/drains/organisations/${params.ownerId}/resources/${resourceId}/drains/${params.drainId}/test-command`,
      headers: new HeadersBuilder().acceptTextPlain().build(),
    };
  }

  transformCommandOutput(response: unknown): SelfOrPromise<GetLogDrainTestCommandCommandOutput> {
    if (typeof response === 'string') {
      return response;
    }
    // The server may answer without an explicit text content-type, in which case `getResponseBody`
    // decodes the body as a Blob; read its text (same pattern as `GetKubernetesKubeconfigCommand`).
    return (response as Blob).text();
  }

  getIdsToResolve(): IdResolve {
    return {
      ownerId: true,
      addonId: 'REAL_ADDON_ID',
    };
  }

  // the backend only formats a shell command out of the drain, it never contacts the recipient itself
  isIdempotent(): boolean {
    return true;
  }
}
