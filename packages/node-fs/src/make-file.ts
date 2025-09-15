import {existsSync} from 'node:fs';
import {mkdir, open} from 'node:fs/promises';
import {dirname} from 'node:path';

import {logger} from './common.js';

/**
 * Creates an empty file at the specified path.
 * If the directory structure does not exist, it will be created recursively.
 * If the file already exists, the operation does nothing.
 *
 * @param {string} path - The full path to the file to create.
 * @returns {Promise<void>} A promise that resolves when the file is created.
 * @throws {Error} Throws a 'make_file_failed' error if the file cannot be created.
 *
 * @example
 * ```ts
 * async function setupFile() {
 *   try {
 *     await makeEmptyFile('./data/new-file.log');
 *     console.log('File created successfully.');
 *   } catch(err) {
 *     console.error('Failed to create file:', err);
 *   }
 * }
 *
 * setupFile();
 * ```
 */
export async function makeEmptyFile(path: string): Promise<void> {
  logger.logMethodArgs?.('makeEmptyFile', {path: '...' + path.slice(-32)});
  try {
    if (existsSync(path) === false) {
      const dir = dirname(path);
      // No need to check for dir existence, mkdir with recursive will handle it.
      await mkdir(dir, {recursive: true});
      // create empty file.
      await (await open(path, 'w')).close();
    }
  }
  catch (err) {
    logger.error('makeEmptyFile', 'make_file_failed', {path}, err);
    throw new Error('make_file_failed', {cause: (err as Error).cause});
  }
}
