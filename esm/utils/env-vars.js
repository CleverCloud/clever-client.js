/**
 * https://stackoverflow.com/questions/2821043/allowed-characters-in-linux-environment-variable-names
 * Default bash/Linux rules are:
 * letters (upper case only)
 * digits (but not for first char)
 * underscores
 * nothing else
 * /^[a-zA-Z_][a-zA-Z0-9_]*$/
 */

/**
 * Clever Cloud rules are based on this but for some variants like Java, we also allow:
 * letters (lower case)
 * digits for first char
 * dashes
 * dots
 * /^[a-zA-Z0-9-_.]+$/
 */

const ENV_VAR_NAME_REGEX = /^[a-zA-Z0-9-_.]+$/;

export function validateName (name) {
  return ENV_VAR_NAME_REGEX.test(name);
}

export const ERROR_TYPES = {
  INVALID_NAME: 0,
  DUPLICATED_NAME: 1,
  INVALID_LINE: 2,
  INVALID_VALUE: 3,
};

const NEW_LINE = '\n';
const SIMPLE_QUOTE = '\'';
const EQUAL = '=';
const SLASH = '\\';
const SIMPLE_QUOTE_REPLACE = /([\\]*)'/g;
const DOUBLE_QUOTE = '"';
const DOUBLE_QUOTE_REPLACE = /([\\]*)"/g;

function nextIndex (text, char, start = 0) {
  let i = start;
  let escaped = false;
  while (i < text.length) {
    if (text[i] === char && !escaped) {
      return i;
    }
    escaped = (text[i] === '\\');
    i += 1;
  }
  return i;
}

function isEmptyLine (line) {
  return line.trim() === '';
}

function isCommentLine (line) {
  return line.trim().startsWith('#');
}

function getPosition (text, index) {
  const lines = text.substring(0, index).split(NEW_LINE);
  const line = lines.length;
  const column = lines.slice(-1)[0].length;
  return { line, column };
}

// Here we surround a string with double quotes,
// it means we need to escape existing double quotes,
// we need to do so in a way that is compatible with shells and environment variables,
// this is why we have (slashes * 2 + 1).
function doubleQuoteString (str) {
  const escapedString = str.replace(DOUBLE_QUOTE_REPLACE, (m, slashes) => {
    return SLASH.repeat(slashes.length * 2 + 1) + DOUBLE_QUOTE;
  });
  return DOUBLE_QUOTE + escapedString + DOUBLE_QUOTE;
}

// Here we must be able to reverse what doubleQuoteString() does,
// with the same logic,
// we also want it to work with simple quotes.
function unquoteString (firstChar, str) {
  if (firstChar === SIMPLE_QUOTE) {
    return str.replace(SIMPLE_QUOTE_REPLACE, (match, slashes) => {
      return SLASH.repeat((slashes.length - 1) / 2) + SIMPLE_QUOTE;
    });
  }
  if (firstChar === DOUBLE_QUOTE) {
    return str.replace(DOUBLE_QUOTE_REPLACE, (match, slashes) => {
      return SLASH.repeat((slashes.length - 1) / 2) + DOUBLE_QUOTE;
    });
  }
  return str;
}

export function parseRaw (rawInput = '') {

  const parsedVariables = [];
  const parsingErrors = [];
  const allNames = new Set();

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

    if (!validateName(name)) {
      parsingErrors.push({ type: ERROR_TYPES.INVALID_NAME, name, pos: getPosition(rawInput, startIdx) });
    }

    if (allNames.has(name)) {
      parsingErrors.push({ type: ERROR_TYPES.DUPLICATED_NAME, name, pos: getPosition(rawInput, startIdx) });
    }
    else {
      allNames.add(name);
    }

    const valueFirstChar = rawInput[nextEqualIdx + 1];
    if (valueFirstChar === SIMPLE_QUOTE || valueFirstChar === DOUBLE_QUOTE) {
      const nextQuoteIdx = nextIndex(rawInput, valueFirstChar, nextEqualIdx + 2);
      const rawValue = rawInput.substring(nextEqualIdx + 2, nextQuoteIdx);
      const value = unquoteString(valueFirstChar, rawValue);
      parsedVariables.push({ name, value });
      if (nextNewLineIdx > nextQuoteIdx + 1 || nextQuoteIdx + 1 > rawInput.length) {
        parsingErrors.push({ type: ERROR_TYPES.INVALID_VALUE, name, pos: getPosition(rawInput, nextQuoteIdx + 1) });
        startIdx = nextNewLineIdx + 1;
      }
      else {
        startIdx = nextQuoteIdx + 1;
      }
    }
    else {
      const value = rawInput.substring(nextEqualIdx + 1, nextNewLineIdx);
      parsedVariables.push({ name, value });
      startIdx = nextNewLineIdx + 1;
    }
  }

  // WARN: Array.prototype.sort edits in place
  parsedVariables.sort((a, b) => a.name.localeCompare(b.name));

  return { variables: parsedVariables, errors: parsingErrors };
}

// automatically merges duplicated named (keeps last value)
// automatically removes variables with invalid names
// always double quote values (with proper escaping)
export function toNameEqualsValueString (variables, options = {}) {
  const { addExports = false } = options;
  return variables
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, value }) => {
      const quotedValue = doubleQuoteString(value);
      const nameValue = `${name}=${quotedValue}`;
      return addExports
        ? `export ${nameValue};`
        : nameValue;
    })
    .join('\n');
}

// automatically merges duplicated named (keeps last value)
// automatically removes variables with invalid names
export function toNameValueObject (variables) {
  const keyValueObject = {};
  variables
    .filter(({ name }) => validateName(name))
    .forEach(({ name, value }) => {
      keyValueObject[name] = value;
    });
  return keyValueObject;
}
