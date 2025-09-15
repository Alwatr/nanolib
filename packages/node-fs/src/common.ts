import {AsyncQueue} from '@alwatr/async-queue';
import {createLogger} from '@alwatr/logger';

/**
 * The logger instance for the `@alwatr/node-fs` package.
 * @private
 */
export const logger = /* #__PURE__ */ createLogger('@alwatr/node-fs');

/**
 * A shared `AsyncQueue` instance to manage concurrent file system operations.
 * This helps prevent race conditions and ensures that file operations are executed in a controlled manner.
 * @private
 */
export const asyncQueue = /* #__PURE__ */ new AsyncQueue();
