import { UNKNOWN_TO_CLIENT } from '../lib/utils.js';
import type { Known, UnknownToClient } from '../types/utils.types.js';

/**
 * The two types the predicates below narrow with, re-exported: `types/utils.types.js` is not a
 * package entry point, so this module is the only place consumers can name them.
 */
export type { Known, UnknownToClient };

/**
 * Whether the given union member is the variant the client could not map.
 *
 * A client may be older than the API it talks to, so a discriminated union coming out of a
 * command can carry a variant this client does not know. That variant answers `UNKNOWN_TO_CLIENT`
 * on the discriminant and hands the raw payload over. This narrows to it.
 *
 * Prefer this over comparing the discriminant yourself: the unions do not agree on which key they
 * discriminate on, and this takes that key as an argument.
 *
 * @template T - The discriminated union the item comes from
 * @template D - The key the union discriminates on
 * @param item - The union member to test
 * @param discriminant - The key the union discriminates on, defaults to `type`
 * @returns Whether the item is the unknown variant
 *
 * @example
 * if (isUnknown(drain.target)) {
 *   console.log('unsupported log drain target', drain.target.payload);
 * }
 *
 * @example
 * // Kubernetes events discriminate on `event` rather than on `type`.
 * if (isUnknown(event, 'event')) {
 *   console.log('unsupported cluster event', event.payload);
 * }
 */
export function isUnknown<T, D extends string = 'type'>(
  item: T,
  discriminant: D = 'type' as D,
): item is Extract<T, UnknownToClient<D>> {
  return (
    item != null && typeof item === 'object' && (item as Record<string, unknown>)[discriminant] === UNKNOWN_TO_CLIENT
  );
}

/**
 * Whether the given union member is one of the variants the client knows.
 *
 * This is the negation of {@link isUnknown}, and it narrows to {@link Known}. Use it to drop the
 * unknown variant from a list, or to reach a `switch` that only has to spell out the known cases.
 *
 * @template T - The discriminated union the item comes from
 * @template D - The key the union discriminates on
 * @param item - The union member to test
 * @param discriminant - The key the union discriminates on, defaults to `type`
 * @returns Whether the item is a known variant
 *
 * @example
 * const peers = networkGroup.peers.filter((peer) => isKnown(peer));
 * // peers: Array<NetworkGroupPeerClever | NetworkGroupPeerExternal>
 *
 * @example
 * // Pass the predicate a lambda rather than `filter(isKnown)`: the array index would land on the
 * // `discriminant` argument.
 * const events = allEvents.filter((event) => isKnown(event, 'event'));
 */
export function isKnown<T, D extends string = 'type'>(item: T, discriminant: D = 'type' as D): item is Known<T, D> {
  return !isUnknown(item, discriminant);
}
