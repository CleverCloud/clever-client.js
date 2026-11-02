/**
 * Brands a class the way another copy of `@clevercloud/client` brands its own: with the same
 * `Symbol.for()` keys, on a class this copy never defined, so that `instanceof` cannot recognize its
 * instances and only the brand can.
 *
 * The keys are spelled out rather than taken from `createBrand()`: they are a contract between
 * versions, and a test has to fail if one of them changes.
 *
 * @param prototype - The prototype of the class to brand
 * @param kinds - The kinds the class belongs to, its own and those of the classes it stands for extending
 */
export function brandAsForeignCopy(prototype: object, ...kinds: Array<string>): void {
  for (const kind of kinds) {
    Object.defineProperty(prototype, Symbol.for(`@clevercloud/client/${kind}`), { value: true });
  }
}
