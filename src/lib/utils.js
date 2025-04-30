/**
 * @param {T} obj
 * @param {Array<K>} keys
 * @returns {Omit<T, K>}
 * @template {object} T
 * @template {keyof T} K
 */
export function omit(obj, ...keys) {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * @param {T | Array<T>} value
 * @returns {Array<T>}
 * @template T
 */
export function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

/**
 * @param {Date|string|number} date
 * @returns {string|null}
 */
export function normalizeDate(date) {
  if (date == null) {
    return null;
  }

  let parsedDate;

  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else if (typeof date === 'string') {
    // remove potential '[UTC]' suffix
    let fixedDateString = date.replace(/(.+)(\[UTC\])/g, '$1');
    // fix milliseconds of iso strings that can be on 1 or 2 digits: '42' instead of '042'
    const match = fixedDateString.match(/^(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.)(\d{1,3})Z$/);
    if (match != null) {
      const fixedMillis = match[2].padStart(3, '0');
      fixedDateString = `${match[1]}${fixedMillis}Z`;
    }

    parsedDate = new Date(fixedDateString);
  }

  if (parsedDate != null) {
    return parsedDate.toISOString();
  }

  throw new Error(`Invalid date: ${date}`);
}

/**
 * @returns {Promise<string>}
 */
export async function randomUUID() {
  const cryptoModule = crypto ?? (await import('node:crypto'));
  return cryptoModule.randomUUID();
}

/**
 * Create a safe URL where every value is automatically encoded with the `encodeURIComponent()` function.
 *
 * Note that only string values are encoded. Other types are just converted to string.
 *
 * @param {TemplateStringsArray} strings
 * @param {Array<?>} values
 * @returns {string}
 */
export function safeUrl(strings, ...values) {
  let result = '';

  strings.forEach((string, index) => {
    result += string + encode(values[index]);
  });

  return result;
}

/**
 * Encodes the given string into base64, and take care of non-ASCII chars by encoding to utf8 before transforming to base64
 * @param {string} string
 * @returns {string}
 */
export function encodeToBase64(string) {
  // encode string to utf-8
  const bytes = new TextEncoder().encode(string);
  // convert bytes into string
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
  // encode into base64
  return btoa(binString);
}

/**
 * @param {Array<T>} array
 * @param {Array<K|{key: K, order: 'asc'|'desc'}>} keys
 * @return {Array<T>}
 * @template {object} T
 * @template {keyof T|((item: T) => any)} K
 */
export function sortBy(array, ...keys) {
  if (array.length === 0) {
    return [];
  }

  return [...array].sort((a, b) => {
    for (const keyDefinition of keys) {
      /** @type {keyof T|((item: T) => any)} */
      const key = typeof keyDefinition === 'object' ? keyDefinition.key : keyDefinition;
      /** @type {(item: T) => any} */
      const getter = typeof key === 'function' ? key : (item) => item[key];

      const order = typeof keyDefinition === 'object' ? keyDefinition.order : 'asc';
      const orderFactor = order === 'asc' ? 1 : -1;

      const first = getter(a);
      const second = getter(b);
      if (first < second) {
        return orderFactor * -1;
      }
      if (first > second) {
        return orderFactor * 1;
      }
    }
    return 0;
  });
}

/**
 * Merge object1 with object2 but ignore all null properties of object2.
 *
 * @param {T} object1
 * @param {Partial<T>|null} object2
 * @returns {T}
 * @template T
 */
export function merge(object1, object2) {
  const o2 = object2 == null ? {} : pickNonNull(object2);
  return { ...object1, ...o2 };
}

/**
 * @param {?|null} value
 * @returns {string}
 */
function encode(value) {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string') {
    return encodeURIComponent(value);
  }

  return String(value);
}

/**
 * @param {T} object
 * @returns {T}
 * @template T
 */
function pickNonNull(object) {
  /** @type {T} */
  const result = { ...object };

  for (const key in result) {
    if (result[key] == null) {
      delete result[key];
    }
  }

  return result;
}
