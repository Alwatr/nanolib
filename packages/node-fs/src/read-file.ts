import {readFileSync as readFileSync_} from 'node:fs';
import {readFile as readFile_} from 'node:fs/promises';

import {flatString} from '@alwatr/flat-string';

import {logger} from './common';
import {parseJson} from './json';

import type {MaybePromise} from '@alwatr/type-helper';

/**
 * Enhanced read file (async).
 *
 * @param path - file path
 * @returns file content
 * @example
 * ```typescript
 * const fileContent = await readFile('./file.txt');
 * ```
 */
export function readFile(path: string): Promise<string>;
/**
 * Enhanced read file (sync).
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns file content
 * @example
 * ```typescript
 * const fileContent = readFile('./file.txt', true);
 * ```
 */
export function readFile(path: string, sync: true): string;
/**
 * Enhanced read File.
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns file content
 * @example
 * ```typescript
 * const fileContent = await readFile('./file.txt', sync);
 * ```
 */
export function readFile(path: string, sync: boolean): MaybePromise<string>;
/**
 * Enhanced read File.
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns file content
 * @example
 * ```typescript
 * const fileContent = await readFile('./file.txt');
 * ```
 */
export function readFile(path: string, sync = false): MaybePromise<string> {
  logger.logMethodArgs?.('readFile', {path: path.slice(-32), sync});
  // if (!existsSync(path)) throw new Error('file_not_found');
  if (sync === true) {
    try {
      return flatString(readFileSync_(path, {encoding: 'utf-8', flag: 'r'}));
    }
    catch (err) {
      logger.error('readFile', 'read_file_failed', err);
      throw new Error('read_file_failed', {cause: (err as Error).cause});
    }
  }
  // else, async mode
  return readFile_(path, {encoding: 'utf-8', flag: 'r'}).then(
    (content) => flatString(content),
    (err) => {
      logger.error('readFile', 'read_file_failed', err);
      throw new Error('read_file_failed', {cause: (err as Error).cause});
    },
  );
}

/**
 * Enhanced read json file (async).
 *
 * @param path - file path
 * @returns json object
 * @example
 * ```typescript
 * const fileContent = await readJsonFile('./file.json');
 * ```
 */
export function readJsonFile(path: string): Promise<unknown>;
/**
 * Enhanced read json file (sync).
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns json object
 * @example
 * ```typescript
 * const fileContent = readJsonFile('./file.json', true);
 * ```
 */
export function readJsonFile(path: string, sync: true): unknown;
/**
 * Enhanced read json file.
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns json object
 * @example
 * ```typescript
 * const fileContent = await readJsonFile('./file.json', sync);
 * ```
 */
export function readJsonFile(path: string, sync: boolean): MaybePromise<unknown>;
/**
 * Enhanced read json file.
 *
 * @param path - file path
 * @param sync - sync mode
 * @returns json object
 * @example
 * ```typescript
 * const fileContent = await readJsonFile('./file.json');
 * ```
 */
export function readJsonFile(path: string, sync = false): MaybePromise<unknown> {
  logger.logMethodArgs?.('readJsonFile', {path: path.slice(-32), sync});
  if (sync === true) {
    return parseJson(readFile(path, true));
  }
  // else, async mode
  return readFile(path).then((content) => parseJson(content));
}
