import {logger} from './common.js';

/**
 * Safely parses a JSON string into a JavaScript object.
 * This function wraps `JSON.parse` with error handling.
 *
 * @template T - The expected type of the parsed JSON object.
 * @param {string} content - The JSON string to parse.
 * @returns {T} The parsed JavaScript object.
 * @throws {Error} Throws an 'invalid_json' error if parsing fails.
 *
 * @example
 * ```ts
 * const json = parseJson('{"a":1,"b":2}');
 * console.log(json.a); // 1
 *
 * try {
 *   parseJson('invalid json');
 * } catch(e) {
 *   console.error(e.message); // 'invalid_json'
 * }
 * ```
 */
export function parseJson<T extends JsonValue>(content: string): T {
  try {
    return JSON.parse(content);
  }
  catch (err) {
    logger.error('parseJson', 'invalid_json', err);
    throw new Error('invalid_json', {cause: (err as Error).cause});
  }
}

/**
 * Safely stringifies a JavaScript object into a JSON string.
 * This function wraps `JSON.stringify` with error handling.
 *
 * @template T - The type of the data to stringify.
 * @param {T} data - The JavaScript object to stringify.
 * @returns {string} The JSON string representation of the object.
 * @throws {Error} Throws a 'stringify_failed' error if stringification fails (e.g., due to circular references).
 *
 * @example
 * ```ts
 * const jsonString = jsonStringify({a: 1, b: 2});
 * console.log(jsonString); // '{"a":1,"b":2}'
 *
 * const circular = { a: 1 };
 * circular.b = circular;
 * try {
 *   jsonStringify(circular);
 * } catch(e) {
 *   console.error(e.message); // 'stringify_failed'
 * }
 * ```
 */
export function jsonStringify<T extends JsonValue>(data: T): string {
  try {
    return JSON.stringify(data);
  }
  catch (err) {
    logger.error('jsonStringify', 'stringify_failed', err);
    throw new Error('stringify_failed', {cause: (err as Error).cause});
  }
}
