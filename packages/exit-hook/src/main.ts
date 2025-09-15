/**
 * An array of callback functions to be executed on process exit.
 * It's initialized to `null` and created on the first `exitHook` call.
 * @private
 */
let callbacks: (() => void)[] | null = null;

/**
 * A flag to ensure that the exit callbacks are only executed once.
 * @private
 */
let exiting = false;

/**
 * Registers a callback function to be executed when the Node.js process is about to exit.
 * This is useful for performing cleanup tasks like saving data, closing connections, etc.
 *
 * @param {() => void} callback - The function to be called on process exit.
 *
 * @example
 * ```ts
 * import { exitHook } from '@alwatr/exit-hook';
 *
 * exitHook(() => {
 *   console.log('Performing cleanup before exit...');
 *   // e.g., save data to a file
 * });
 *
 * // To test, you can send a SIGINT signal (Ctrl+C) to the process.
 * ```
 */
export function exitHook(callback: () => void): void {
  if (callbacks === null) {
    registerExitEvents_();
    callbacks = [];
  }
  callbacks.push(callback);
}

/**
 * The single, shared callback that is registered with `process.once`.
 * It iterates over and executes all registered user callbacks.
 * @private
 */
function onExit_(signal: number | 'SIGINT' | 'SIGTERM'): void {
  console.log('onExit_({signal: %s})', signal);
  if (exiting === true || callbacks === null) return;

  exiting = true;

  for (const callback of callbacks) {
    try {
      callback();
    }
    catch (error) {
      console.error('Error in exit hook callback:', error);
    }
  }

  // In case of SIGINT or SIGTERM, we need to exit the process explicitly after a short delay.
  if (signal === 'SIGINT' || signal === 'SIGTERM') {
    setTimeout(() => {
      process.exit(0);
    }, 100);
  }
}

/**
 * Registers the `onExit_` handler for various process exit events.
 * This function is called only once when the first exit hook is registered.
 * @private
 */
function registerExitEvents_(): void {
  /**
   * This event is emitted when the Node.js process is about to exit as a result of either:
   * 1. The `process.exit()` method being called explicitly.
   * 2. The Node.js event loop no longer having any additional work to perform.
   *
   * @see https://nodejs.org/api/process.html#event-exit
   */
  process.once('exit', onExit_);

  /**
   * This event is emitted when the Node.js process receives a `SIGTERM` signal.
   * This is a common signal for process termination.
   *
   * @see https://nodejs.org/api/process.html#signal-events
   */
  process.once('SIGTERM', onExit_);

  /**
   * This event is emitted when the Node.js process receives a `SIGINT` signal,
   * typically from `Ctrl+C`.
   *
   * @see https://nodejs.org/api/process.html#signal-events
   */
  process.once('SIGINT', onExit_);
}
