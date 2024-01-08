import {writeFileSync as writeFileSync_, existsSync, mkdirSync, copyFileSync, renameSync} from 'node:fs';
import {copyFile, mkdir, rename, writeFile as writeFile_} from 'node:fs/promises';
import {dirname} from 'node:path';

import {flatString} from '@alwatr/flat-string';

import {jsonStringify} from './json';
import {logger} from './logger';

import type { MaybePromise } from '@alwatr/type-helper';

/**
 * Write file mode for exists file.
 */
export enum WriteFileMode {
  Replace = 'replace',
  Rename = 'rename',
  Copy = 'copy',
}

/**
 * Enhanced write file (async).
 *
 * @param path - file path
 * @param content - file content
 * @param mode - handle exists file (replace, copy, rename)
 * @example
 * ```typescript
 * await writeFile('./file.txt', 'Hello World!', WriteFileMode.Replace);
 * ```
 */
export function writeFile(path: string, content: string, mode: WriteFileMode, sync?: false): Promise<void>;
/**
 * Enhanced write file (sync).
 *
 * @param path - file path
 * @param content - file content
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * writeFile('./file.txt', 'Hello World!', WriteFileMode.Replace, true);
 * ```
 */
export function writeFile(path: string, content: string, mode: WriteFileMode, sync: true): void;
/**
 * Enhanced write file.
 *
 * @param path - file path
 * @param content - file content
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * await writeFile('./file.txt', 'Hello World!', WriteFileMode.Replace, sync);
 * ```
 */
export function writeFile(path: string, content: string, mode: WriteFileMode, sync: boolean): MaybePromise<void>;
/**
 * Enhanced write file.
 *
 * @param path - file path
 * @param content - file content
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * await writeFile('./file.txt', 'Hello World!', WriteFileMode.Replace);
 * ```
 */
export function writeFile(path: string, content: string, mode: WriteFileMode, sync = false): MaybePromise<void> {
  logger.logMethodArgs?.('writeFile', {path: path.slice(-32), mode, sync});
  if (sync === true) {
    handleExistsFile(path, mode, true);
    try {
      logger.logOther?.('write_file_start', {path: path.slice(-32), sync});
      writeFileSync_(path, content, {encoding: 'utf-8', flag: 'w'});
      logger.logOther?.('write_file_success', {path: path.slice(-32), sync});
      return;
    }
    catch (err) {
      logger.error('writeFile', 'write_file_failed', err);
      throw new Error('write_file_failed', {cause: (err as Error).cause});
    }
  }
  // else, async mode
  return handleExistsFile(path, mode)
    .then(() => {
      logger.logOther?.('write_file_start', {path: path.slice(-32), sync});
      return writeFile_(path, content, {encoding: 'utf-8', flag: 'w'});
    })
    .then(() => {
      logger.logOther?.('write_file_success', {path: path.slice(-32), sync});
    })
    .catch((err) => {
      logger.error('writeFile', 'write_file_failed', err);
      throw new Error('write_file_failed', {cause: (err as Error).cause});
    });
}

/**
 * Handle exists file (async).
 *
 * @param path - file path
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * await handleExistsFile('./file.txt', WriteFileMode.Rename);
 * ```
 */
export function handleExistsFile(path: string, mode: WriteFileMode): Promise<void>;
/**
 * Handle exists file (sync).
 *
 * @param path - file path
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * handleExistsFile('./file.txt', WriteFileMode.Rename, true);
 * ```
 */
export function handleExistsFile(path: string, mode: WriteFileMode, sync: true): void;
/**
 * Handle exists file.
 *
 * @param path - file path
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * await handleExistsFile('./file.txt', WriteFileMode.Rename, sync);
 * ```
 */
export function handleExistsFile(path: string, mode: WriteFileMode, sync: boolean): MaybePromise<void>;
/**
 * Handle exists file.
 *
 * @param path - file path
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * await handleExistsFile('./file.txt', WriteFileMode.Rename);
 * ```
 */
export function handleExistsFile(path: string, mode: WriteFileMode, sync = false): MaybePromise<void> {
  logger.logMethodArgs?.('handleExistsFile', {path: path.slice(-32), mode, sync});
  if (sync === true) {
    if (existsSync(path)) {
      if (mode === WriteFileMode.Copy) {
        try {
          copyFileSync(path, path + '.bk');
        }
        catch (err) {
          logger.error('handleExistsFile', 'copy_failed', err);
        }
      }
      else if (mode === WriteFileMode.Rename) {
        try {
          renameSync(path, path + '.bk');
        }
        catch (err) {
          logger.error('handleExistsFile', 'rename_failed', err);
        }
      }
    }
    else {
      try {
        mkdirSync(dirname(path), {recursive: true});
      }
      catch (err) {
        logger.error('handleExistsFile', 'make_dir_failed', err);
        throw new Error('make_dir_failed', {cause: (err as Error).cause});
      }
    }
  }
  else {
    // async mode
    if (existsSync(path)) {
      // existsSync is much faster than access.
      if (mode === WriteFileMode.Copy) {
        return copyFile(path, path + '.bk').catch((err) => {
          logger.error('handleExistsFile', 'copy_failed', err);
        });
      }
      else if (mode === WriteFileMode.Rename) {
        return rename(path, path + '.bk').catch((err) => {
          logger.error('handleExistsFile', 'rename_failed', err);
        });
      }
    }
    else {
      return mkdir(dirname(path), {recursive: true})
        .then(() => {
          logger.logOther?.('handleExistsFile', 'make_dir_success');
        })
        .catch((err) => {
          logger.error('handleExistsFile', 'make_dir_failed', err);
          throw new Error('make_dir_failed', {cause: (err as Error).cause});
        });
    }

    return Promise.resolve(); // do nothing but return a resolved promise.
  }
}

/**
 * Enhanced write json file (async).
 *
 * @param path - file path
 * @param data - json object
 * @param mode - handle exists file (replace, copy, rename)
 * @example
 * ```typescript
 * await writeJsonFile('./file.json', { a:1, b:2, c:3 }, WriteFileMode.Replace);
 * ```
 */
export function writeJsonFile(path: string, data: unknown, mode: WriteFileMode, sync?: false): Promise<void>;
/**
 * Enhanced write json file (sync).
 *
 * @param path - file path
 * @param data - json object
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * writeJsonFile('./file.json', { a:1, b:2, c:3 }, WriteFileMode.Replace, true);
 * ```
 */
export function writeJsonFile(path: string, data: unknown, mode: WriteFileMode, sync: true): void;
/**
 * Enhanced write json file.
 *
 * @param path - file path
 * @param data - json object
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * await writeJsonFile('./file.json', { a:1, b:2, c:3 }, WriteFileMode.Replace, sync);
 * ```
 */
export function writeJsonFile(path: string, data: unknown, mode: WriteFileMode, sync: boolean): MaybePromise<void>;
/**
 * Enhanced write json file.
 *
 * @param path - file path
 * @param data - json object
 * @param mode - handle exists file (replace, copy, rename)
 * @param sync - sync mode
 * @example
 * ```typescript
 * await writeJsonFile('./file.json', { a:1, b:2, c:3 }, WriteFileMode.Replace);
 * ```
 */
export function writeJsonFile(path: string, data: unknown, mode: WriteFileMode, sync = false): MaybePromise<void> {
  logger.logMethodArgs?.('writeJsonFile', {path: path.slice(-32), mode, sync});
  return writeFile(path, flatString(jsonStringify(data)), mode, sync);
}
