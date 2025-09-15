/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Represents a "flat promise" or "deferred promise".
 * This is a promise object that exposes its `resolve` and `reject` functions,
 * allowing it to be settled from outside the promise's constructor.
 *
 * @template T - The type of the value that the promise will resolve to.
 */
export interface Flatomise<T> {
  /**
   * The underlying `Promise` instance. You can `await` this or attach `.then()` handlers to it.
   */
  readonly promise: Promise<T>;

  /**
   * A function that, when called, resolves the `promise` with the given value.
   *
   * @param {T | PromiseLike<T>} value - The value to resolve the promise with.
   */
  readonly resolve: (value: T | PromiseLike<T>) => void;

  /**
   * A function that, when called, rejects the `promise` with the given reason.
   *
   * @param {any} [reason] - The reason for rejecting the promise.
   */
  readonly reject: (reason?: any) => void;

  /**
   * A boolean flag indicating whether the promise has been settled (either resolved or rejected).
   */
  readonly settled: boolean;
}

/**
 * Creates a new `Flatomise` instance.
 *
 * A "flatomise" is a useful pattern when you need to create a promise but settle it
 * later in a different scope, such as in response to an event or a callback.
 *
 * @template T - The type of the value that the promise will resolve to.
 * @returns {Flatomise<T>} A new `Flatomise` object.
 *
 * @example
 * ```ts
 * import { newFlatomise } from '@alwatr/flatomise';
 *
 * function createDelayedValue() {
 *   const flatomise = newFlatomise<string>();
 *
 *   setTimeout(() => {
 *     // This resolve function is called from outside the promise constructor.
 *     flatomise.resolve('Hello, from the future!');
 *   }, 1000);
 *
 *   return flatomise.promise;
 * }
 *
 * async function main() {
 *   console.log('Waiting for the delayed value...');
 *   const value = await createDelayedValue();
 *   console.log('Received:', value); // Received: Hello, from the future!
 * }
 *
 * main();
 * ```
 */
export function newFlatomise<T>(): Flatomise<T> {
  const flatomise: Partial<Mutable<Flatomise<T>>> = {settled: false};
  flatomise.promise = new Promise<T>((resolve, reject) => {
    flatomise.resolve = resolve;
    flatomise.reject = reject;
  });
  flatomise.promise.finally(() => {
    flatomise.settled = true;
  });
  return flatomise as Flatomise<T>;
}
