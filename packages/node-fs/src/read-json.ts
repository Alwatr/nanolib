import {logger} from './common.js';
import {parseJson} from './json.js';
import {readFile, readFileSync} from './read-file.js';

/**
 * Reads a JSON file and parses it into a JavaScript object.
 * This function can operate in both synchronous and asynchronous modes.
 *
 * @template T - The expected type of the parsed JSON object.
 *
 * @param {string} path - The path to the JSON file.
 * @returns {Promise<T>} A promise that resolves with the parsed JSON object.
 *
 * @example
 * ```ts
 * // Asynchronous usage
 * const myData = await readJson<MyType>('./data.json');
 * console.log(myData.property);
 * ```
 */
export function readJson<T extends JsonValue>(path: string): Promise<T>;
/**
 * Reads a JSON file synchronously and parses it into a JavaScript object.
 *
 * @template T - The expected type of the parsed JSON object.
 *
 * @param {string} path - The path to the JSON file.
 * @param {true} sync - A literal `true` to indicate synchronous operation.
 * @returns {T} The parsed JSON object.
 *
 * @example
 * ```ts
 * // Synchronous usage
 * try {
 *   const myData = readJson<MyType>('./data.json', true);
 *   console.log(myData.property);
 * } catch(err) {
 *   console.error('Failed to read JSON file:', err);
 * }
 * ```
 */
export function readJson<T extends JsonValue>(path: string, sync: true): T;
/**
 * Reads a JSON file and parses it into a JavaScript object.
 *
 * @template T - The expected type of the parsed JSON object.
 *
 * @param {string} path - The path to the JSON file.
 * @param {boolean} sync - If `true`, the operation is synchronous.
 * @returns {Awaitable<T>} The parsed JSON object, or a promise that resolves with it.
 */
export function readJson<T extends JsonValue>(path: string, sync: boolean): Awaitable<T>;
export function readJson<T extends JsonValue>(path: string, sync = false): Awaitable<T> {
  logger.logMethodArgs?.('readJson', {path: path.slice(-32), sync});
  if (sync === true) {
    return parseJson<T>(readFileSync(path));
  }
  else {
    return readFile(path).then((content) => parseJson<T>(content));
  }
}
