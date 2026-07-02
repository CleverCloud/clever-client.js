// this is an ESM rewrite of https://github.com/oprogramador/sort-any without lodash

type Comparator = (a: unknown, b: unknown) => number;

const types = {
  undefined: Symbol('undefined'),
  null: Symbol('null'),
  boolean: Symbol('boolean'),
  NaN: Symbol('NaN'),
  number: Symbol('number'),
  string: Symbol('string'),
  symbol: Symbol('symbol'),
  date: Symbol('date'),
  set: Symbol('set'),
  array: Symbol('array'),
  map: Symbol('map'),
  object: Symbol('object'),
};

const typesValues = Object.values(types);
const orderedTypes: Record<symbol, number> = Object.fromEntries(typesValues.map((symbol, index) => [symbol, index]));

const comparators: Record<symbol, Comparator> = {
  [types.array]: compareArray,
  [types.set]: (a, b) => compareArray([...(a as Set<unknown>)], [...(b as Set<unknown>)]),
  [types.map]: (a, b) =>
    compareObject(Object.fromEntries(a as Map<unknown, unknown>), Object.fromEntries(b as Map<unknown, unknown>)),
  [types.number]: standardCompare,
  [types.object]: compareObject,
  [types.string]: standardCompare,
  [types.symbol]: (a, b) =>
    standardCompare((a as symbol).toString().slice(0, -1), (b as symbol).toString().slice(0, -1)),
};

function getOrderByType(type: symbol): number {
  return orderedTypes[type];
}

function getTypeByValue(value: unknown): symbol {
  if (typeof value === 'undefined') {
    return types.undefined;
  }
  if (value == null) {
    return types.null;
  }
  if (typeof value === 'boolean') {
    return types.boolean;
  }
  if (typeof value === 'number' && Number.isNaN(value)) {
    return types.NaN;
  }
  if (typeof value === 'number') {
    return types.number;
  }
  if (typeof value === 'string') {
    return types.string;
  }
  if (typeof value === 'symbol') {
    return types.symbol;
  }
  if (value instanceof Date) {
    return types.date;
  }
  if (value instanceof Set) {
    return types.set;
  }
  if (value instanceof Map) {
    return types.map;
  }
  if (Array.isArray(value)) {
    return types.array;
  }

  return types.object;
}

function standardCompare(first: unknown, second: unknown): number {
  if ((first as number) < (second as number)) {
    return -1;
  }
  if ((first as number) > (second as number)) {
    return 1;
  }

  return 0;
}

function compareArray(first: unknown, second: unknown): number {
  const firstArray = first as Array<unknown>;
  const secondArray = second as Array<unknown>;
  if (firstArray.length < secondArray.length) {
    return -1;
  }
  if (secondArray.length < firstArray.length) {
    return 1;
  }
  const sortedFirst = sortAny(firstArray);
  const sortedSecond = sortAny(secondArray);

  for (let i = 0; i < firstArray.length; i++) {
    const compareResult = compare(sortedFirst[i], sortedSecond[i]);
    if (compareResult) {
      return compareResult;
    }
  }

  for (let i = 0; i < firstArray.length; i++) {
    const compareResult = compare(firstArray[i], secondArray[i]);
    if (compareResult) {
      return compareResult;
    }
  }

  return 0;
}

function compareObject(first: unknown, second: unknown): number {
  const firstObject = first as Record<string, unknown>;
  const secondObject = second as Record<string, unknown>;
  const firstKeys = Object.keys(firstObject);
  const secondKeys = Object.keys(secondObject);
  if (firstKeys.length < secondKeys.length) {
    return -1;
  }
  if (secondKeys.length < firstKeys.length) {
    return 1;
  }
  const sortedFirstKeys = sortAny(firstKeys) as Array<string>;
  const sortedSecondKeys = sortAny(secondKeys) as Array<string>;

  for (let i = 0; i < firstKeys.length; i++) {
    const compareResult = compare(sortedFirstKeys[i], sortedSecondKeys[i]);
    if (compareResult) {
      return compareResult;
    }
  }

  for (let i = 0; i < firstKeys.length; i++) {
    const key = sortedFirstKeys[i];
    const compareResult = compare(firstObject[key], secondObject[key]);
    if (compareResult) {
      return compareResult;
    }
  }

  for (let i = 0; i < firstKeys.length; i++) {
    const compareResult = compare(firstKeys[i], secondKeys[i]);
    if (compareResult) {
      return compareResult;
    }
  }

  return 0;
}

function compare(first: unknown, second: unknown): number {
  const firstType = getTypeByValue(first);
  const secondType = getTypeByValue(second);
  const firstOrder = getOrderByType(firstType);
  const secondOrder = getOrderByType(secondType);
  const differenceByType = firstOrder - secondOrder;
  if (differenceByType) {
    return differenceByType;
  }
  const comparator = comparators[firstType] || standardCompare;

  return comparator(first, second);
}

export function sortAny(array: Array<unknown>): Array<unknown> {
  const undefinedsArray = array.filter((x) => typeof x === 'undefined');
  const notUndefinedsArray = array.filter((x) => typeof x !== 'undefined');

  return [...undefinedsArray, ...[...notUndefinedsArray].sort(compare)];
}
