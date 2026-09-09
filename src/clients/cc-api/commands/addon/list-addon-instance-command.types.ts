import type { AddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the add-on whose instances are listed. The owner is resolved automatically when omitted.
 */
export type ListAddonInstanceCommandInput = AddonId;

/**
 * The virtual machines currently backing the add-on.
 */
export type ListAddonInstanceCommandOutput = Array<AddonInstance>;

/**
 * A virtual machine backing an add-on: one of the instances the add-on's deployment runs on.
 */
export interface AddonInstance {
  /** Identifier of the instance, a bare UUID. */
  id: string;
  /**
   * Real id of the add-on the instance runs.
   * @renamedFrom `appId`
   */
  realId: string;
  /** IP address the instance can be reached at. */
  ip: string;
  /**
   * Port the add-on listens on.
   * @renamedFrom `appPort`
   */
  port: number;
  /** Current lifecycle state of the instance. */
  state: AddonInstanceState;
  /** Scaler flavor the instance runs on, which sets its CPU and RAM. */
  flavor: AddonInstanceFlavor;
  /**
   * Identifier of the commit deployed on the instance.
   * @renamedFrom `commit`
   */
  commitId: string;
  /** Position of the deployment that created the instance. Absent when unknown. */
  deployNumber?: number;
  /** Identifier of the deployment that created the instance. */
  deployId: string;
  /** Position of the instance within its deployment. */
  instanceNumber: number;
  /** Display name of the instance, as shown in the console. */
  displayName: string;
  /**
   * When the instance was created.
   * @renamedFrom `creationDate`
   * @converted to an ISO date string
   */
  createdAt: string;
}

/** Lifecycle state of an add-on instance. */
export type AddonInstanceState =
  | 'BOOTING'
  | 'STARTING'
  | 'DEPLOYING'
  | 'MIGRATION_IN_PROGRESS'
  | 'TASK_IN_PROGRESS'
  | 'READY'
  | 'UP'
  | 'GHOST'
  | 'STOPPING'
  | 'DELETED';

/**
 * A scaler size: how much CPU and memory one add-on instance gets, and what it costs.
 */
export interface AddonInstanceFlavor {
  /** Name of the flavor, for example `XS` or `S`. */
  name: string;
  /** Memory, in mebibytes. */
  mem: number;
  /** Number of CPUs. */
  cpus: number;
  /** Price of one hour of runtime on this flavor. */
  price: number;
}
