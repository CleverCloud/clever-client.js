/**
 * Key with its type
 */
export interface Key {
  /**
   * The name of the key
   */
  name: string;
  /**
   * The type of the key, as reported by the Redis© `TYPE` command: `string`, `list`, `set`, `zset`,
   * `hash`, `stream`... The proxy passes this through as a free string, so it is not a closed set.
   */
  type: string;
}
