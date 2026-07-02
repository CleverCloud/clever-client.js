/**
 * @fileoverview Utilities for parsing, validating, and converting environment variables.
 *
 * This module provides comprehensive functionality for working with environment variables
 * in various formats, including shell format (NAME=value), JSON format, and structured
 * JavaScript objects. It supports proper quote handling, multi-line values, validation,
 * and error reporting.
 *
 * Key features:
 * - Parse shell-format environment variables with proper escaping
 * - Parse JSON-format environment variables
 * - Convert between different formats (JSON, shell, objects, arrays)
 * - Validate variable names according to different standards
 * - Handle duplicates, invalid names, and malformed input gracefully
 * - Comprehensive error reporting with line/column information
 */

import type { EnvironmentVariable, EnvVarParsingError, EnvVarValidationMode } from './environment.types.js';

/**
 * https://stackoverflow.com/questions/2821043/allowed-characters-in-linux-environment-variable-names
 * Default bash/Linux rules for environment variable names are:
 *
 * - letters (upper case only)
 * - digits (but not for first char)
 * - underscores
 *
 * /^[A-Z_][A-Z0-9_]*$/
 *
 * We don't use this.
 */

/**
 * Most Linux systems also accept lower case letters:
 *
 * - letters (upper case and lower case)
 * - digits (but not for first char)
 * - underscores
 */
const ENV_VAR_NAME_STRICT_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/**
 * Clever Cloud rules are based on this but for some variants like Java, we also allow dashes and dots:
 *
 * - letters (upper case and lower case)
 * - digits (any position)
 * - underscores
 * - dashes
 * - dots
 */
const ENV_VAR_NAME_REGEX = /^[a-zA-Z0-9-_.]+$/;

const NEW_LINE = '\n';
const SIMPLE_QUOTE = "'";
const EQUAL = '=';
const SLASH = '\\';
const SIMPLE_QUOTE_REPLACE = /([\\]*)'/g;
const DOUBLE_QUOTE = '"';
const DOUBLE_QUOTE_REPLACE = /([\\]*)"/g;

export const ERROR_TYPES = {
  INVALID_NAME: 0,
  DUPLICATED_NAME: 1,
  INVALID_LINE: 2,
  INVALID_VALUE: 3,
  INVALID_JSON: 4,
  INVALID_JSON_FORMAT: 5,
  INVALID_JSON_ENTRY: 6,
  INVALID_NAME_STRICT: 7,
  JAVA_INFO: 8,
};

/**
 * Validates an environment variable name according to the specified mode.
 *
 * Supports two validation modes:
 * - 'simple': Allows letters, digits, underscores, dashes, and dots (Clever Cloud extended)
 * - 'strict': Only allows letters, digits (not first char), and underscores (Linux standard)
 *
 * @param name - The environment variable name to validate
 * @param mode - Validation mode: 'simple' or 'strict' ('simple' by default)
 * @returns True if the name is valid according to the specified mode
 */
export function validateName(name: string, mode: EnvVarValidationMode = 'simple'): boolean {
  return mode !== 'strict' ? ENV_VAR_NAME_REGEX.test(name) : ENV_VAR_NAME_STRICT_REGEX.test(name);
}

/**
 * Parses raw environment variable input in shell format (NAME=value) into structured data.
 *
 * Supports various input formats:
 * - Simple format: NAME=value
 * - Quoted values: NAME="value" or NAME='value'
 * - Multi-line values with proper escaping
 * - Comments (lines starting with #)
 * - Empty lines (ignored)
 *
 * The parser handles:
 * - Proper quote escaping and unescaping
 * - Multi-line values
 * - Duplicate variable detection
 * - Invalid name validation
 * - Malformed line detection
 *
 * @param rawInput - Raw environment variables string in shell format
 * @param options - Parsing options including validation mode
 * @returns Object containing parsed variables and any parsing errors encountered
 */
export function parseRaw(
  rawInput = '',
  options: { mode?: EnvVarValidationMode } = {},
): { variables: Array<EnvironmentVariable>; errors: Array<EnvVarParsingError> } {
  const parsedVariables: Array<EnvironmentVariable> = [];
  const parsingErrors: Array<EnvVarParsingError> = [];
  const allNames = new Set<string>();
  const { mode = 'simple' } = options;

  let startIdx = 0;
  while (startIdx < rawInput.length) {
    const nextNewLineIdx = nextIndex(rawInput, NEW_LINE, startIdx);
    const line = rawInput.substring(startIdx, nextNewLineIdx);

    if (isEmptyLine(line) || isCommentLine(line)) {
      startIdx = nextNewLineIdx + 1;
      continue;
    }

    if (!line.includes(EQUAL)) {
      parsingErrors.push({ type: ERROR_TYPES.INVALID_LINE, pos: getPosition(rawInput, startIdx) });
      startIdx = nextNewLineIdx + 1;
      continue;
    }

    const nextEqualIdx = nextIndex(rawInput, EQUAL, startIdx);
    const name = rawInput.substring(startIdx, nextEqualIdx);

    const isNameInvalidSimple = !validateName(name, 'simple');
    const isNameInvalidStrict = !validateName(name, 'strict');

    if (isNameInvalidStrict && mode === 'strict') {
      parsingErrors.push({ type: ERROR_TYPES.INVALID_NAME_STRICT, name, pos: getPosition(rawInput, startIdx) });
    } else if (isNameInvalidStrict && isNameInvalidSimple && mode !== 'strict') {
      parsingErrors.push({ type: ERROR_TYPES.INVALID_NAME, name, pos: getPosition(rawInput, startIdx) });
    } else if (isNameInvalidStrict && !isNameInvalidSimple && mode !== 'strict') {
      parsingErrors.push({ type: ERROR_TYPES.JAVA_INFO, name, pos: getPosition(rawInput, startIdx) });
    }

    const isNameDuplicated = allNames.has(name);
    if (isNameDuplicated) {
      parsingErrors.push({ type: ERROR_TYPES.DUPLICATED_NAME, name, pos: getPosition(rawInput, startIdx) });
    } else {
      allNames.add(name);
    }

    const valueFirstChar = rawInput[nextEqualIdx + 1];
    if (valueFirstChar === SIMPLE_QUOTE || valueFirstChar === DOUBLE_QUOTE) {
      const nextQuoteIdx = nextIndex(rawInput, valueFirstChar, nextEqualIdx + 2);
      const rawValue = rawInput.substring(nextEqualIdx + 2, nextQuoteIdx);
      const value = unquoteString(valueFirstChar, rawValue);

      const isValueInvalid = nextNewLineIdx > nextQuoteIdx + 1 || nextQuoteIdx + 1 > rawInput.length;

      if (!isNameInvalidStrict && !isNameDuplicated && !isValueInvalid && mode === 'strict') {
        parsedVariables.push({ name, value });
      } else if (
        !isNameInvalidSimple &&
        isNameInvalidStrict &&
        !isNameDuplicated &&
        !isValueInvalid &&
        mode !== 'strict'
      ) {
        parsedVariables.push({ name, value });
      } else if (
        !isNameInvalidSimple &&
        !isNameInvalidStrict &&
        !isNameDuplicated &&
        !isValueInvalid &&
        mode !== 'strict'
      ) {
        parsedVariables.push({ name, value });
      }

      if (isValueInvalid) {
        parsingErrors.push({ type: ERROR_TYPES.INVALID_VALUE, name, pos: getPosition(rawInput, nextQuoteIdx + 1) });
        startIdx = nextNewLineIdx + 1;
      } else {
        startIdx = nextQuoteIdx + 1;
      }
    } else {
      const value = rawInput.substring(nextEqualIdx + 1, nextNewLineIdx);

      if (!isNameInvalidStrict && !isNameDuplicated && mode === 'strict') {
        parsedVariables.push({ name, value });
      } else if (!isNameInvalidSimple && isNameInvalidStrict && !isNameDuplicated && mode !== 'strict') {
        parsedVariables.push({ name, value });
      } else if (!isNameInvalidSimple && !isNameInvalidStrict && !isNameDuplicated && mode !== 'strict') {
        parsedVariables.push({ name, value });
      }

      startIdx = nextNewLineIdx + 1;
    }
  }

  // WARN: Array.prototype.sort edits in place
  parsedVariables.sort((a, b) => a.name.localeCompare(b.name));

  return { variables: parsedVariables, errors: parsingErrors };
}

/**
 * Parses raw environment variable input in JSON format into structured data.
 *
 * Expects input in JSON format with name-value pairs:
 * ```json
 * {
 *   "VAR_NAME": "value",
 *   "ANOTHER_VAR": "another value"
 * }
 * ```
 *
 * The parser handles:
 * - JSON parsing with error handling
 * - Variable name validation according to specified mode
 * - Invalid name detection and error reporting
 * - Type validation (ensures all values are strings)
 *
 * @param rawInput - Raw environment variables string in JSON format
 * @param options - Parsing options including validation mode
 * @returns Object containing an array of parsed environment variables and any parsing errors encountered
 */
export function parseRawJson(
  rawInput = '',
  options: { mode?: EnvVarValidationMode } = {},
): { variables: Array<EnvironmentVariable>; errors: Array<EnvVarParsingError> } {
  let parsedInput: unknown;
  const parsingErrors: Array<EnvVarParsingError> = [];
  const { mode = 'simple' } = options;

  try {
    parsedInput = JSON.parse(rawInput);
  } catch {
    parsingErrors.push({ type: ERROR_TYPES.INVALID_JSON });
    return { variables: [], errors: parsingErrors };
  }

  if (!Array.isArray(parsedInput) || parsedInput.some((entry) => typeof entry !== 'object')) {
    parsingErrors.push({ type: ERROR_TYPES.INVALID_JSON_FORMAT });
    return { variables: [], errors: parsingErrors };
  }

  const entries = parsedInput as Array<{ name?: unknown; value?: unknown }>;
  const variablesWithNameValue = entries.filter(
    (entry): entry is EnvironmentVariable => typeof entry.name === 'string' && typeof entry.value === 'string',
  );
  if (variablesWithNameValue.length < entries.length) {
    parsingErrors.push({ type: ERROR_TYPES.INVALID_JSON_ENTRY });
  }

  const validVariables: Array<EnvironmentVariable> = [];
  const visitedNames: Array<string> = [];
  const duplicatedNames = new Set<string>();
  const invalidNames = new Set<string>();
  const infoJava = new Set<string>();

  variablesWithNameValue.forEach((variable) => {
    const isNameDuplicated = visitedNames.includes(variable.name);
    const isNameInvalidSimple = !validateName(variable.name, 'simple');
    const isNameInvalidStrict = !validateName(variable.name, 'strict');

    if (isNameDuplicated) {
      duplicatedNames.add(variable.name);
    }

    if (isNameInvalidStrict && mode === 'strict') {
      invalidNames.add(variable.name);
    } else if (isNameInvalidSimple && isNameInvalidStrict && mode !== 'strict') {
      invalidNames.add(variable.name);
    }

    if (!isNameDuplicated && !isNameInvalidStrict && mode === 'strict') {
      visitedNames.push(variable.name);
      validVariables.push(variable);
    } else if (!isNameInvalidSimple && !isNameInvalidStrict && !isNameDuplicated && mode !== 'strict') {
      visitedNames.push(variable.name);
      validVariables.push(variable);
    } else if (!isNameInvalidSimple && isNameInvalidStrict && !isNameDuplicated && mode !== 'strict') {
      visitedNames.push(variable.name);
      validVariables.push(variable);
      infoJava.add(variable.name);
    }
  });

  Array.from(duplicatedNames).forEach((name) => {
    parsingErrors.push({ type: ERROR_TYPES.DUPLICATED_NAME, name });
  });

  Array.from(invalidNames).forEach((name) => {
    if (mode !== 'strict') {
      parsingErrors.push({ type: ERROR_TYPES.INVALID_NAME, name });
    } else {
      parsingErrors.push({ type: ERROR_TYPES.INVALID_NAME_STRICT, name });
    }
  });

  Array.from(infoJava).forEach((name) => parsingErrors.push({ type: ERROR_TYPES.JAVA_INFO, name }));

  validVariables.sort((a, b) => a.name.localeCompare(b.name));

  return { variables: validVariables, errors: parsingErrors };
}

/**
 * Converts an array of environment variables into a formatted JSON string.
 *
 * Features:
 * - Automatically sorts variables by name for consistent output
 * - Uses 2-space indentation for readability
 *
 * @param variables - Array of environment variables to convert
 * @returns Formatted JSON string representation of the variables
 */
export function toJson(variables: Array<EnvironmentVariable>): string {
  if (variables.length === 0) {
    return '[]';
  }
  const sortedVariables = [...variables].sort((a, b) => a.name.localeCompare(b.name));
  return JSON.stringify(sortedVariables, null, 2);
}

/**
 * Converts an array of environment variables into a shell-compatible string format.
 *
 * Features:
 * - Always double-quotes values with proper escaping
 * - Sorts variables by name for consistent output
 * - Optional export prefix for shell sourcing
 *
 * Output format:
 * - Without exports: `VAR_NAME="value"`
 * - With exports: `export VAR_NAME="value"`
 *
 * @param variables - The environment variables to convert
 * @param options - Options object
 * @returns Shell-compatible string representation of the variables
 */
export function toNameEqualsValueString(
  variables: Array<EnvironmentVariable>,
  options: { addExports?: boolean } = {},
): string {
  const { addExports = false } = options;
  return [...variables]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, value }) => {
      const quotedValue = doubleQuoteString(value);
      const nameValue = `${name}=${quotedValue}`;
      return addExports ? `export ${nameValue};` : nameValue;
    })
    .join('\n');
}

/**
 * Converts an array of environment variables into a plain JavaScript object.
 *
 * Features:
 * - Automatically merges duplicated names (keeps last value)
 * - Removes variables with invalid names
 *
 * @param variables - The environment variables to convert
 * @returns Plain object with variable names as keys and values as strings
 */
export function toNameValueObject(variables: Array<EnvironmentVariable>): Record<string, string> {
  const keyValueObject: Record<string, string> = {};
  variables
    .filter(({ name }) => validateName(name))
    .forEach(({ name, value }) => {
      keyValueObject[name] = value;
    });
  return keyValueObject;
}

/**
 * Converts a plain JavaScript object into an array of environment variables.
 *
 * This is the inverse operation of toNameValueObject. It takes a simple key-value
 * object and converts it into the structured EnvironmentVariable format.
 *
 * Features:
 * - Automatically removes variables with invalid names
 * - Preserves original key-value relationships
 *
 * @param variables - Plain object with variable names as keys
 * @returns Array of structured environment variable objects
 */
export function toArray(variables: Record<string, string>): Array<EnvironmentVariable> {
  return Object.entries(variables)
    .filter(([name]) => validateName(name))
    .map(([name, value]) => ({ name, value }));
}

// -- private functions ------

/**
 *
 */
function nextIndex(text: string, char: string, start = 0): number {
  let i = start;
  let escaped = false;
  while (i < text.length) {
    if (text[i] === char && !escaped) {
      return i;
    }
    escaped = text[i] === '\\';
    i += 1;
  }
  return i;
}

function isEmptyLine(line: string): boolean {
  return line.trim() === '';
}

function isCommentLine(line: string): boolean {
  return line.trim().startsWith('#');
}

function getPosition(text: string, index: number): { line: number; column: number } {
  const lines = text.substring(0, index).split(NEW_LINE);
  const line = lines.length;
  const column = lines.slice(-1)[0].length;
  return { line, column };
}

function doubleQuoteString(str: string): string {
  // Here we surround a string with double quotes,
  // it means we need to escape existing double quotes,
  // we need to do so in a way that is compatible with shells and environment variables,
  // this is why we have (slashes * 2 + 1).

  const escapedString = str.replace(DOUBLE_QUOTE_REPLACE, (_: string, slashes: string) => {
    return SLASH.repeat(slashes.length * 2 + 1) + DOUBLE_QUOTE;
  });
  return DOUBLE_QUOTE + escapedString + DOUBLE_QUOTE;
}

function unquoteString(firstChar: string, str: string): string {
  // Here we must be able to reverse what doubleQuoteString() does,
  // with the same logic,
  // we also want it to work with simple quotes.

  if (firstChar === SIMPLE_QUOTE) {
    return str.replace(SIMPLE_QUOTE_REPLACE, (_: string, slashes: string) => {
      return SLASH.repeat((slashes.length - 1) / 2) + SIMPLE_QUOTE;
    });
  }
  if (firstChar === DOUBLE_QUOTE) {
    return str.replace(DOUBLE_QUOTE_REPLACE, (_: string, slashes: string) => {
      return SLASH.repeat((slashes.length - 1) / 2) + DOUBLE_QUOTE;
    });
  }
  return str;
}
