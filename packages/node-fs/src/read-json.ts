import {logger} from './common';
import {parseJson} from './json';
import {readFile} from './read-file';

import type {MaybePromise} from '@alwatr/type-helper';

/**
 * Enhanced read json file (async).
 *
 * @param path - file path
 * @returns json object
 * @example
 * ```typescript
 * const fileContent = await readJson('./file.json');
 * ```
 */
export function readJson(path: string): Promise<unknown>;
/**
 * Enhanced read json file (sync).
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns json object
 * @example
 * ```typescript
 * const fileContent = readJson('./file.json', true);
 * ```
 */
export function readJson(path: string, sync: true): unknown;
/**
 * Enhanced read json file.
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns json object
 * @example
 * ```typescript
 * const fileContent = await readJson('./file.json', sync);
 * ```
 */
export function readJson(path: string, sync: boolean): MaybePromise<unknown>;
/**
 * Enhanced read json file.
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns json object
 * @example
 * ```typescript
 * const fileContent = await readJson('./file.json');
 * ```
 */
export function readJson(path: string, sync = false): MaybePromise<unknown> {
  logger.logMethodArgs?.('readJson', {path: path.slice(-32), sync});
  if (sync === true) {
    return parseJson(readFile(path, true));
  }
  // else, async mode
  return readFile(path).then((content) => parseJson(content));
}
