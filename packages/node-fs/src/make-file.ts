import {open} from 'node:fs/promises';

import {logger} from './common.js';

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
export async function makeEmptyFile(path: string): Promise<void> {
  logger.logMethodArgs?.('makeEmptyFile', '...' + path.slice(-32));
  return (await open(path, 'w')).close();
}
