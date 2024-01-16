import type {Json, JsonValue} from '@alwatr/type-helper';

/**
 * Parse json string without throwing error.
 *
 * @param content - json string
 * @returns json object or null if json is invalid
 * @example
 * ```typescript
 * const json = parseJson('{"a":1,"b":2}');
 * console.log(json.a); // 1
 * ```
 */
function parseJson<T extends JsonValue>(content: string): T | null {
  try {
    return JSON.parse(content);
  }
  catch (err) {
    console.error('parseJson', 'invalid_json', err);
    return null;
  }
}

// @TODO: localStorage polyfill (memory fallback)

export const localJsonStorage = {
  /**
   * Generate local storage key.
   *
   * @param name name of the item
   * @param version version of the item (default: 1)
   * @example
   * ```typescript
   * localJsonStorage.key_('myItem', 1); // myItem.v1
   * ```
   */
  key_(name: string, version = 1): string {
    return `${name}.v${version}`;
  },

  /**
   * Get local storage item and parse it as JSON.
   * If item is not found, return default value.
   *
   * @param name name of the item
   * @param defaultValue default value of the item
   * @param version Data structure version of the item (default: 1)
   * @example
   * ```typescript
   * const value = localJsonStorage.getItem('myItem', {a: 1, b: 2});
   * ```
   */
  getItem<T extends Json>(name: string, defaultValue: T, version = 1): T {
    const key = this.key_(name, version);
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    const json = parseJson<T>(value);
    if (json === null || typeof json !== 'object') return defaultValue;
    return json;
  },

  /**
   * Set local storage item as JSON.
   *
   * @param name name of the item
   * @param value value of the item
   * @param version version of the item
   * @example
   * ```typescript
   * localJsonStorage.setItem('myItem', {a: 1, b: 2});
   * ```
   */
  setItem<T extends Json>(name: string, value: T, version = 1): void {
    const key = this.key_(name, version);
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Removes an item from the local storage.
   *
   * @param name - The name of the item to remove.
   * @param version - The version of the item to remove. Default is 1.
   * @example
   * ```typescript
   * localJsonStorage.removeItem('myItem');
   * ```
   */
  removeItem (name: string, version = 1): void {
    const key = this.key_(name, version);
    window.localStorage.removeItem(key);
  },
} as const;
