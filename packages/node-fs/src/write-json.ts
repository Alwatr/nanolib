import {flatString} from '@alwatr/flat-string';

import {logger} from './common.js';
import {jsonStringify} from './json.js';
import {writeFile, writeFileSync} from './write-file.js';

/**
 * Stringifies a JavaScript object and writes it to a JSON file asynchronously.
 * Uses an atomic-like write operation.
 *
 * @template T - The type of the data to write.
 *
 * @param {string} path - The file path.
 * @param {T} data - The JSON object to write.
 * @returns {Promise<void>} A promise that resolves when the file is written.
 *
 * @example
 * ```ts
 * await writeJson('./data.json', { a: 1, b: 2 });
 * ```
 */
export function writeJson<T extends JsonValue>(path: string, data: T, sync?: false): Promise<void>;
/**
 * Stringifies a JavaScript object and writes it to a JSON file synchronously.
 * Uses an atomic-like write operation.
 *
 * @template T - The type of the data to write.
 *
 * @param {string} path - The file path.
 * @param {T} data - The JSON object to write.
 * @param {true} sync - A literal `true` to indicate synchronous operation.
 *
 * @example
 * ```ts
 * writeJson('./data.json', { a: 1, b: 2 }, true);
 * ```
 */
export function writeJson<T extends JsonValue>(path: string, data: T, sync: true): void;
/**
 * Stringifies a JavaScript object and writes it to a JSON file.
 *
 * @template T - The type of the data to write.
 *
 * @param {string} path - The file path.
 * @param {T} data - The JSON object to write.
 * @param {boolean} sync - If `true`, the operation is synchronous.
 * @returns {Awaitable<void>} A promise that resolves when the file is written, or `void` in sync mode.
 */
export function writeJson<T extends JsonValue>(path: string, data: T, sync: boolean): Awaitable<void>;
export function writeJson<T extends JsonValue>(path: string, data: T, sync = false): Awaitable<void> {
  logger.logMethodArgs?.('writeJson', {path: '...' + path.slice(-32), sync});
  const content = flatString(jsonStringify(data));
  return sync === true ? writeFileSync(path, content) : writeFile(path, content);
}
