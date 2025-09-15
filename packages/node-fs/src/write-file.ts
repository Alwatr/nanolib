import {writeFileSync as writeFileSync_, existsSync, mkdirSync, renameSync} from 'node:fs';
import {mkdir, rename, writeFile as writeFile_} from 'node:fs/promises';
import {dirname} from 'node:path';

import {asyncQueue, logger} from './common.js';

/**
 * Writes a file synchronously with an atomic-like operation.
 *
 * It first writes the content to a temporary file (`.tmp`), and if successful,
 * it renames the original file to a backup (`.bak`) and then renames the temporary
 * file to the final path. This ensures that the original file is not corrupted
 * in case of a write failure. It also creates the directory recursively if it doesn't exist.
 *
 * @param {string} path - The file path.
 * @param {Buffer | string} content - The file content.
 * @throws {Error} Throws a 'write_file_failed' error if any step in the process fails.
 *
 * @example
 * ```ts
 * try {
 *   writeFileSync('./data/my-file.txt', 'Hello, Alwatr!');
 * } catch(err) {
 *   console.error('File write failed:', err);
 * }
 * ```
 */
export function writeFileSync(path: string, content: Buffer | string): void {
  logger.logMethodArgs?.('writeFileSync', {path: '...' + path.slice(-32)});
  try {
    const pathExists = existsSync(path);
    if (!pathExists) {
      const dir = dirname(path);
      if (!existsSync(dir)) {
        mkdirSync(dir, {recursive: true});
      }
    }
    writeFileSync_(path + '.tmp', content, {encoding: 'utf-8', flag: 'w'});
    if (pathExists) {
      renameSync(path, path + '.bak');
    }
    renameSync(path + '.tmp', path);
    logger.logOther?.('writeFileSync success', {path: '...' + path.slice(-32)});
  }
  catch (err) {
    logger.error('writeFileSync', 'write_file_failed', {path}, err);
    throw new Error('write_file_failed', {cause: (err as Error).cause});
  }
}

/**
 * Writes a file asynchronously with an atomic-like operation and queuing.
 *
 * It uses an async queue to prevent race conditions. The write operation itself is atomic-like:
 * it writes to a temporary file, backs up the original, and then renames the temp file.
 *
 * @param {string} path - The file path.
 * @param {Buffer | string} content - The file content.
 * @returns {Promise<void>} A promise that resolves when the file has been successfully written.
 *
 * @example
 * ```ts
 * async function saveFile() {
 *   try {
 *     await writeFile('./data/my-file.txt', 'Hello, Alwatr!');
 *     console.log('File saved successfully.');
 *   } catch(err) {
 *     console.error('File write failed:', err);
 *   }
 * }
 *
 * saveFile();
 * ```
 */
export function writeFile(path: string, content: Buffer | string): Promise<void> {
  logger.logMethodArgs?.('writeFile', {path: '...' + path.slice(-32)});
  return asyncQueue.push(path, async () => {
    try {
      logger.logOther?.('writeFile start', {path: '...' + path.slice(-32)});
      const pathExists = existsSync(path);
      if (!pathExists) {
        const dir = dirname(path);
        if (!existsSync(dir)) {
          await mkdir(dir, {recursive: true});
        }
      }
      await writeFile_(path + '.tmp', content, {encoding: 'utf-8', flag: 'w'});
      if (pathExists) {
        await rename(path, path + '.bak');
      }
      await rename(path + '.tmp', path);
      logger.logOther?.('writeFile success', {path: '...' + path.slice(-32)});
    }
    catch (err) {
      logger.error('writeFile', 'write_file_failed', {path}, err);
      throw new Error('write_file_failed', {cause: (err as Error).cause});
    }
  });
}
