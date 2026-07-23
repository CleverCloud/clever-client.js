import type { AddonId } from '../../types/cc-api.types.js';

/**
 * Identifies the add-on whose logs are retrieved, and how to narrow the retrieval down. The owner is resolved
 * automatically when omitted.
 */
export interface ListLogCommandInput extends AddonId {
  /** Maximum number of log lines to return. */
  limit?: number;
  /** Direction the log lines are returned in. */
  order?: 'ASC' | 'DESC';
  /**
   * Keep only the lines emitted at or after this moment.
   * @sentAs `after`
   * @converted to an ISO date string
   */
  since?: Date | string | number;
  /**
   * Keep only the lines emitted at or before this moment.
   * @sentAs `before`
   * @converted to an ISO date string
   */
  until?: Date | string | number;
  /** Keep only the lines whose message contains this text. */
  filter?: string;
  /**
   * Keep only the lines emitted during this deployment.
   * @sentAs `deployment_id`
   */
  deploymentId?: string;
}

/**
 * The matching log lines, in the legacy v2 shape.
 */
export type ListLogCommandOutput = Array<OldLog>;

/**
 * One log line as the legacy v2 log store exposes it. The store is document-oriented, so every field is
 * lifted out of the indexed document's `_source`.
 */
export interface OldLog {
  /**
   * Identifier of the indexed log document.
   * @renamedFrom `_id`
   */
  id: string;
  /**
   * When the line was emitted.
   * @renamedFrom `_source.@timestamp`
   */
  date: string;
  /**
   * The log line itself.
   * @renamedFrom `_source.message`
   */
  message: string;
  /**
   * Kind of document the line was indexed as.
   * @renamedFrom `_source.type`
   */
  type: string;
  /**
   * Syslog severity of the line.
   * @renamedFrom `_source.syslog_severity`
   */
  severity: string;
  /**
   * Name of the program that emitted the line.
   * @renamedFrom `_source.syslog_program`
   */
  program: string;
  /**
   * Identifier of the deployment the line was emitted during.
   * @renamedFrom `_source.deploymentId`
   */
  deploymentId: string;
  /**
   * Host name of the machine that emitted the line.
   * @renamedFrom `_source.host`
   */
  sourceHost: string;
  /**
   * IP address the line was collected from.
   * @renamedFrom `_source.@source`
   */
  sourceIp: string;
  /**
   * Name of the zone the emitting machine runs in.
   * @renamedFrom `_source.zone`
   */
  zone: string;
}
