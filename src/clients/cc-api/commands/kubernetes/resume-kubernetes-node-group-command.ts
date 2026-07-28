import { post } from '../../../../lib/request/request-params-builder.js';
import { safeUrl } from '../../../../lib/utils.js';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import { transformKubernetesNodeGroup } from './kubernetes-transform.js';
import type {
  ResumeKubernetesNodeGroupCommandInput,
  ResumeKubernetesNodeGroupCommandOutput,
} from './resume-kubernetes-node-group-command.types.js';

/**
 * Resumes a node group stuck in the `FAILED` status, re-running the operation that failed.
 *
 * Recovery boots or drains real machines and takes several minutes; the command returns as soon as
 * it is accepted, with the node group in a transitional state that only settles once the operation
 * has gone through.
 *
 * @endpoint [POST] /v4/kubernetes/organisations/:XXX/clusters/:XXX/node-groups/:XXX/resume
 * @group Kubernetes
 * @version 4
 */
export class ResumeKubernetesNodeGroupCommand extends CcApiSimpleCommand<
  ResumeKubernetesNodeGroupCommandInput,
  ResumeKubernetesNodeGroupCommandOutput
> {
  toRequestParams(params: ResumeKubernetesNodeGroupCommandInput) {
    return post(
      safeUrl`/v4/kubernetes/organisations/${params.ownerId}/clusters/${params.clusterId}/node-groups/${params.nodeGroupId}/resume`,
    );
  }

  transformCommandOutput(response: unknown): ResumeKubernetesNodeGroupCommandOutput {
    return transformKubernetesNodeGroup(response);
  }

  // the recovery runs in the background and leaves the node group in `DEPLOYING` meanwhile, which is
  // the very status the handler accepts, so a replay starts a second recovery over the first
  isIdempotent(): boolean {
    return false;
  }
}
