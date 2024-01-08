import {open, close} from 'node:fs';

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
