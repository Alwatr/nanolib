import {newFlatomise} from '@alwatr/flatomise';

import type {Dictionary} from '@alwatr/type-helper';

/**
 * A queue that executes async tasks in order like mutex and semaphore methodology
 *
 * @example
 * ```ts
 * const queue = new AsyncQueue();
 *
 * function longTask() {
 *   queue.push('longTaskId', async () => {
 *     // ...
 *   });
 * }
 * ```
 */
export class AsyncQueue {
  queue_: Dictionary<Promise<void>> = {};

  /**
   * Push a async task to the queue.
   *
   * @param taskId task id
   * @param task async task
   * @returns A promise that resolves when the task is done.
   *
   * @example
   * ```typescript
   * const queue = new AsyncQueue();
   *
   * function longTask() {
   *  queue.push('longTaskId', async () => {
   *   // ...
   * });
   * ```
   */
  async push(taskId: string, task: () => Promise<void>): Promise<void> {
    const flatomise = newFlatomise();

    const previousTaskPromise = this.queue_[taskId];
    this.queue_[taskId] = flatomise.promise;

    try {
      await previousTaskPromise;
    }
    catch (_e) {
      // ignore
    }

    setTimeout(() => {
      task().then(flatomise.resolve, flatomise.reject).then(() => {
        if (this.queue_[taskId] === flatomise.promise) {
          delete this.queue_[taskId];
        }
      });
    }, 0);

    return flatomise.promise;
  }
}
