import {
  readFileSync as readFileSync_,
  writeFileSync as writeFileSync_,
  existsSync,
  mkdirSync,
  copyFileSync,
  renameSync,
  open,
  close,
} from 'node:fs';
import {copyFile, mkdir, readFile as readFile_, rename, writeFile as writeFile_, unlink} from 'node:fs/promises';
import {dirname} from 'node:path';

import {flatString} from '@alwatr/flat-string';
import {definePackage} from '@alwatr/logger';

import type {} from '@alwatr/nano-build';
import type {MaybePromise} from '@alwatr/type-helper';

export {resolve} from 'node:path';
export {unlink, existsSync};

const logger = definePackage('@alwatr/node-fs', __package_version__);

/**
 * Parse json string.
 *
 * @param content - json string
 * @returns json object
 * @example
 * ```typescript
 * const json = parseJson('{"a":1,"b":2}');
 * console.log(json.a); // 1
 * ```
 */
export function parseJson(content: string) {
  try {
    return JSON.parse(content);
  }
  catch (err) {
    logger.error('parseJson', 'invalid_json', err);
    throw new Error('invalid_json', {cause: (err as Error).cause});
  }
}

/**
 * Stringify json object.
 *
 * @param data - json object
 * @returns json string
 * @example
 * ```typescript
 * const json = jsonStringify({a:1, b:2});
 * console.log(json); // '{"a":1,"b":2}'
 * ```
 */
export function jsonStringify(data: unknown): string {
  try {
    return JSON.stringify(data);
  }
  catch (err) {
    logger.error('jsonStringify', 'stringify_failed', err);
    throw new Error('stringify_failed', {cause: (err as Error).cause});
  }
}

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
  return readFile_(path, {encoding: 'utf-8', flag: 'r'})
    .then((content) => flatString(content))
    .catch((err) => {
      logger.error('readFile', 'read_file_failed', err);
      throw new Error('read_file_failed', {cause: (err as Error).cause});
    });
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

/**
 * Make empty file.
 *
 * @param path - file path
 *
 * @example
 * ```ts
 * await makeFile('./file.txt');
 * ```
 */
export async function makeFile(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    open(path, 'w', (err, fileDescriptor) => {
      if (err != null) return reject(err);
      close(fileDescriptor, (err) => {
        if (err != null) return reject(err);
        resolve();
      });
    });
  });
}
