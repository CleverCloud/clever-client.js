import { get } from '../../../../lib/request/request-params-builder.ts';
import { CcApiSimpleCommand } from '../../lib/cc-api-command.ts';
import type { GetKubernetesProductCommandOutput } from './get-kubernetes-product-command.types.ts';
import { transformKubernetesProduct } from './kubernetes-transform.ts';

/**
 * Lists what a new Kubernetes cluster can be built from: the control-plane layouts on offer and the
 * versions available.
 *
 * @endpoint [GET] /v4/kubernetes-product
 * @group Kubernetes
 * @version 4
 */
export class GetKubernetesProductCommand extends CcApiSimpleCommand<void, GetKubernetesProductCommandOutput> {
  toRequestParams() {
    return get('/v4/kubernetes-product');
  }

  transformCommandOutput(response: unknown): GetKubernetesProductCommandOutput {
    return transformKubernetesProduct(response);
  }

  isIdempotent(): boolean {
    return true;
  }
}
