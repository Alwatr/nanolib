/**
  * Array of callback functions to be called when the process is exiting.
 */
const callbacks: (() => void)[] = [];

/**
 * True whether the process is exiting.
 */
let exiting = false;

/**
 * Add a callback function to be called when the process is exiting.
 *
 * @param callback The callback function to be called when the process is exiting.
 * @returns void
 *
 * @example
 * ```typescript
 * const saveAllData = () => {
 *   // save all data
 * };
 *
 * existHook(saveAllData);
 * ```
 */
export function existHook(callback: () => void): void {
  callbacks.push(callback);
}

/**
 * A once callback to be called on process exit event.
 *
 * @returns void
 */
function onExit_() {
  if (exiting === true) return;
  exiting = true;

  for (const callback of callbacks) {
    try {
      callback();
    }
    catch (error) {
      console.error('Error in exit hook callback:', error);
    }
  }
}

/**
 *
 */
process.once('beforeExit', onExit_);

/**
 */
process.once('exit', onExit_);

/**
 */
process.once('SIGTERM', onExit_);

/**
 */
process.once('SIGINT', onExit_);
