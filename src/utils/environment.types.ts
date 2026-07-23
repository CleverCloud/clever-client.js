/**
 * How strictly environment variable names are checked: `simple` accepts anything the platform will
 * pass through, `strict` only accepts names a POSIX shell can export.
 */
export type EnvVarValidationMode = 'simple' | 'strict';

/**
 * One environment variable, as a name and value pair.
 */
export interface EnvironmentVariable {
  /** Name of the variable, the one the runtime reads it under. */
  name: string;
  /** Value of the variable, always a string. */
  value: string;
}

/**
 * A problem found while parsing a block of environment variables.
 */
export interface EnvVarParsingError {
  /** Code identifying what went wrong. */
  type: number;
  /** Name of the variable the problem was found on, when it could be read. */
  name?: string;
  /** Where the problem sits in the parsed text, so an editor can point at it. */
  pos?: {
    /** One-based line number. */
    line: number;
    /** One-based column number. */
    column: number;
  };
}
