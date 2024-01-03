/**
 * Flat promise that can be resolved or rejected from outside.
 */
export interface Flatomise {
  promise: Promise<void>;
  resolve: () => void;
  reject: () => void;
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
export function newFlatomise(): Flatomise {
  const flatomise: Partial<Flatomise> = {};
  flatomise.promise = new Promise<void>((resolve, reject) => {
    flatomise.resolve = resolve;
    flatomise.reject = reject;
  });
  return flatomise as Flatomise;
}
