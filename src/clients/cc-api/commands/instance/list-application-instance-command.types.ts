import type { ApplicationId } from '../../types/cc-api.types.js';
import type { Instance, InstanceState } from './instance.types.js';

/**
 * Identifies the application whose instances are listed, and how to narrow the listing down. The owner is
 * resolved automatically when omitted.
 */
export interface ListApplicationInstanceCommandInput extends ApplicationId {
  /**
   * Keep only the instances created at or after this moment.
   * @converted to an ISO date string
   */
  since?: Date | number | string;
  /**
   * Keep only the instances created at or before this moment.
   * @converted to an ISO date string
   */
  until?: Date | number | string;
  /**
   * Keep only the instances in one of these states.
   * @sentAs `includeState`
   * @converted repeated once per state
   */
  includeState?: Array<InstanceState>;
  /**
   * Drop the instances in one of these states.
   * @sentAs `excludeState`
   * @converted repeated once per state
   */
  excludeState?: Array<InstanceState>;
  /** Keep only the instances created by this deployment. */
  deploymentId?: string;
  /** Maximum number of instances to return. The backend caps it, and defaults it, to 1000. */
  limit?: number;
  /** Creation-date direction the backend sorts on before truncating to `limit`. Defaults to `DESC`. */
  order?: 'DESC' | 'ASC';
}

/**
 * The matching instances. Sorted by creation date, then by index within a deployment.
 */
export type ListApplicationInstanceCommandOutput = Array<Instance>;
