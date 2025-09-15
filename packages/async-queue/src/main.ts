import {newFlatomise} from '@alwatr/flatomise';

/**
 * A queue that executes async tasks in order, like a mutex or semaphore.
 * It ensures that for a given task ID, only one async task is running at a time.
 *
 * @example
 * ```ts
 * const queue = new AsyncQueue();
 *
 * function longTask(id: number) {
 *   return queue.push(`my-task-${id}`, async () => {
 *     console.log(`Task ${id} started`);
 *     await new Promise(resolve => setTimeout(resolve, 1000));
 *     console.log(`Task ${id} finished`);
 *     return id;
 *   });
 * }
 *
 * longTask(1);
 * longTask(2);
 * // Output:
 * // Task 1 started
 * // (1 second later)
 * // Task 1 finished
 * // Task 2 started
 * // (1 second later)
 * // Task 2 finished
 * ```
 */
export class AsyncQueue {
  /**
   * A record of task IDs and their corresponding last queued task promises.
   * This ensures that tasks with the same ID are executed sequentially.
   * @private
   */
  private queue__: DictionaryOpt<Promise<unknown>> = {};

  /**
   * Pushes an async task to the queue.
   * If a task with the same `taskId` is already in the queue, this task will wait for the previous one to finish.
   *
   * @param {string} taskId - A unique identifier for the task. Tasks with the same ID are queued.
   * @param {() => Promise<T>} task - The async function to execute.
   * @returns {Promise<T>} A promise that resolves with the return value of the task when it's completed.
   *
   * @example
   * ```ts
   * const queue = new AsyncQueue();
   *
   * async function saveUserData(user: User) {
   *   return queue.push(`user-${user.id}`, async () => {
   *     // Save user data to a database
   *     return await db.users.update(user.id, user);
   *   });
   * }
   * ```
   */
  public async push<T>(taskId: string, task: () => Promise<T>): Promise<T> {
    const flatomise = newFlatomise<T>();

    const previousTaskPromise = this.queue__[taskId];
    this.queue__[taskId] = flatomise.promise;

    try {
      await previousTaskPromise;
    }
    catch (_e) {
      // Errors in previous tasks are ignored, allowing the next task to run.
    }

    setTimeout(() => {
      task()
        .then(flatomise.resolve, flatomise.reject)
        .then(() => {
          // Clean up the queue if this was the last task with this ID.
          if (this.queue__[taskId] === flatomise.promise) {
            delete this.queue__[taskId];
          }
        });
    }, 0);

    return flatomise.promise;
  }

  /**
   * Checks if a task with the given ID is currently running or queued.
   *
   * @param {string} taskId - The ID of the task to check.
   * @returns {boolean} `true` if a task with the given ID is running or queued, otherwise `false`.
   *
   * @example
   * ```ts
   * if (queue.isRunning('long-running-task')) {
   *   console.log('The task is still in progress.');
   * }
   * ```
   */
  public isRunning(taskId: string): boolean {
    return this.queue__[taskId] !== undefined;
  }

  /**
   * Waits for the task with the specified ID to finish.
   * If no task with the given ID is running, it resolves immediately.
   *
   * @param {string} taskId - The ID of the task to wait for.
   * @returns {Promise<unknown>} A promise that resolves when the task is finished.
   *
   * @example
   * ```ts
   * await queue.waitForFinish('initial-setup');
   * console.log('Initial setup is complete.');
   * ```
   */
  public waitForFinish(taskId: string): Promise<unknown> {
    return this.queue__[taskId] ?? Promise.resolve();
  }

  /**
   * Waits for all tasks currently in the queue to finish.
   *
   * @returns {Promise<unknown[]>} A promise that resolves when all tasks in the queue are done.
   *
   * @example
   * ```ts
   * await queue.waitForAllFinish();
   * console.log('All tasks are complete.');
   * ```
   */
  public waitForAllFinish(): Promise<unknown[]> {
    return Promise.all(Object.values(this.queue__));
  }
}
