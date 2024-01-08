import {flatString} from '@alwatr/flat-string';

import {logger} from './common';
import {jsonStringify} from './json';
import {writeFile, writeFileSync} from './write-file';

import type {MaybePromise} from '@alwatr/type-helper';

/**
 * Enhanced write json file (Asynchronous).
 *
 * @param path - file path
 * @param data - json object
 * @example
 * ```typescript
 * await writeJsonFile('./file.json', { a:1, b:2, c:3 });
 * ```
 */
export function writeJson(path: string, data: unknown, sync?: false): Promise<void>;
/**
 * Enhanced write json file (Synchronous).
 *
 * @param path - file path
 * @param data - json object
 * @param sync - sync mode
 * @example
 * ```typescript
 * writeJsonFile('./file.json', { a:1, b:2, c:3 }, true);
 * ```
 */
export function writeJson(path: string, data: unknown, sync: true): void;
/**
 * Enhanced write json file.
 *
 * @param path - file path
 * @param data - json object
 * @param sync - sync mode
 * @example
 * ```typescript
 * await writeJsonFile('./file.json', { a:1, b:2, c:3 }, sync);
 * ```
 */
export function writeJson(path: string, data: unknown, sync: boolean): MaybePromise<void>;
/**
 * Enhanced write json file.
 *
 * @param path - file path
 * @param data - json object
 * @param sync - sync mode
 * @example
 * ```typescript
 * await writeJsonFile('./file.json', { a:1, b:2, c:3 });
 * ```
 */
export function writeJson(path: string, data: unknown, sync = false): MaybePromise<void> {
  logger.logMethodArgs?.('writeJson', '...' + path.slice(-32));
  const content = flatString(jsonStringify(data));
  return sync === true ? writeFileSync(path, content) : writeFile(path, content);
}
