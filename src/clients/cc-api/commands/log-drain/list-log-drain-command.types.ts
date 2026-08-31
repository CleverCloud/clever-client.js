import type { ApplicationOrAddonId } from '../../types/cc-api.types.js';
import type { AuditLogDrain, LogDrain, LogDrainExecutionStatus, LogDrainStatus } from './log-drain.types.js';

/**
 * What to list the drains of: one application or add-on, or a whole organisation.
 */
export type ListLogDrainCommandInput = ListLogDrainCommandInputResource | ListLogDrainCommandInputOwner;

/**
 * Asks for the drains of a single application or add-on. The owner is resolved automatically when omitted.
 */
export type ListLogDrainCommandInputResource = ApplicationOrAddonId & ListLogDrainCommandInputBase;

/**
 * Asks for the drains of a whole organisation: those of every application and add-on it owns, plus its audit
 * log drains, which are attached to no resource.
 */
export interface ListLogDrainCommandInputOwner extends ListLogDrainCommandInputBase {
  /** Identifier of the organisation owning the drains. */
  ownerId: string;
}

/**
 * How to narrow the listing down, whichever scope it covers.
 */
export interface ListLogDrainCommandInputBase {
  /** Keep only the drains in one of these statuses. */
  status?: Array<LogDrainStatus>;
  /** Keep only the drains whose shipping worker is in one of these states. */
  executionStatus?: Array<LogDrainExecutionStatus>;
  /** Drop the drains whose shipping worker is in one of these states. */
  executionStatusNotIn?: Array<LogDrainExecutionStatus>;
}

/**
 * The matching drains. Sorted by last status change, most recent first.
 *
 * The scope the input asked for decides what can come back: a listing scoped to an application or an add-on
 * only answers with the drains attached to it, where an organisation-wide one also carries the organisation's
 * audit log drains, which name no resource. `kind` tells the two apart.
 */
// the tuples stop the conditional from distributing: an input only known as the whole union answers with the
// shape covering both scopes, rather than with a union of the two array types
export type ListLogDrainCommandOutput<TInput extends ListLogDrainCommandInput = ListLogDrainCommandInput> = [
  TInput,
] extends [ListLogDrainCommandInputResource]
  ? Array<LogDrain>
  : Array<LogDrain | AuditLogDrain>;
