import {packageTracer} from '@alwatr/package-tracer';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

/**
 * Flat promise that can be resolved or rejected from outside.
 */
export interface Flatomise<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
}

/**
 * Create a new Flatomise is a promise that can be resolved or rejected from outside.
 *
 * @returns A new Flatomise.
 *
 * @example
 * ```typescript
 * const flatomise = newFlatomise();
 * flatomise.promise.then(() => {
 *   console.log('flatomise resolved');
 * });
 * flatomise.resolve();
 * ```
 */
export function newFlatomise<T>(): Flatomise<T> {
  const flatomise: Partial<Flatomise<T>> = {};
  flatomise.promise = new Promise<T>((resolve, reject) => {
    flatomise.resolve = resolve;
    flatomise.reject = reject;
  });
  return flatomise as Flatomise<T>;
}
