import {readFileSync as readFileSync_} from 'node:fs';
import {readFile as readFile_} from 'node:fs/promises';

import {flatString} from '@alwatr/flat-string';

import {asyncQueue, logger} from './common.js';

/**
 * Reads a file synchronously and returns its content as a UTF-8 string.
 * This is a wrapper around `node:fs.readFileSync` with error handling.
 *
 * @param {string} path - The path to the file.
 * @returns {string} The content of the file.
 * @throws {Error} Throws a 'read_file_failed' error if the file cannot be read.
 *
 * @example
 * ```ts
 * try {
 *   const content = readFileSync('./my-file.txt');
 *   console.log(content);
 * } catch(err) {
 *   console.error('Failed to read file:', err);
 * }
 * ```
 */
export function readFileSync(path: string): string {
  logger.logMethodArgs?.('readFileSync', {path: '...' + path.slice(-32)});
  try {
    return flatString(readFileSync_(path, {encoding: 'utf-8', flag: 'r'}));
  }
  catch (err) {
    logger.error('readFileSync', 'read_file_failed', {path}, err);
    throw new Error('read_file_failed', {cause: (err as Error).cause});
  }
}

/**
 * Reads a file asynchronously and returns its content as a UTF-8 string.
 * It uses an async queue to prevent race conditions with write operations on the same path.
 *
 * @param {string} path - The path to the file.
 * @returns {Promise<string>} A promise that resolves with the content of the file.
 *
 * @example
 * ```ts
 * async function logFileContent() {
 *   try {
 *     const content = await readFile('./my-file.txt');
 *     console.log(content);
 *   } catch(err) {
 *     console.error('Failed to read file:', err);
 *   }
 * }
 *
 * logFileContent();
 * ```
 */
export function readFile(path: string): Promise<string> {
  logger.logMethodArgs?.('readFile', {path: '...' + path.slice(-32)});
  return asyncQueue.push(path, async () => {
    try {
      return flatString(await readFile_(path, {encoding: 'utf-8', flag: 'r'}));
    }
    catch (err) {
      logger.error('readFile', 'read_file_failed', {path}, err);
      throw new Error('read_file_failed', {cause: (err as Error).cause});
    }
  });
}
