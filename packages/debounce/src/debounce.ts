import type {DebouncerConfig} from './type.ts';

/**
 * A powerful, type-safe, and feature-rich Debouncer class.
 *
 * This class encapsulates debouncing logic and state, providing a rich API for fine-grained control.
 * Debouncing is a technique to limit the rate at which a function gets called. It's useful for
 * performance optimization in scenarios like handling user input (e.g., search suggestions),
 * window resizing, or preventing rapid API calls.
 *
 * @template F - The type of the function to be debounced.
 *
 * @example
 * ```ts
 * // Basic trailing-edge debouncing
 * const searchDebouncer = new Debouncer({
 *   func: (query: string) => console.log(`Searching for: ${query}`),
 *   delay: 300,
 * });
 *
 * searchDebouncer.trigger('hello');
 * searchDebouncer.trigger('hello world');
 * // After 300ms of inactivity, it will log: "Searching for: hello world"
 *
 * // Leading-edge debouncing
 * const clickDebouncer = new Debouncer({
 *   func: () => console.log('Button clicked!'),
 *   delay: 500,
 *   leading: true,
 *   trailing: false, // Important: prevent double execution
 * });
 *
 * clickDebouncer.trigger(); // Logs "Button clicked!" immediately.
 * // Further triggers within 500ms are ignored.
 * ```
 */
export class Debouncer<F extends AnyFunction> {
  /**
   * The timer ID for the main debouncing delay.
   * @private
   */
  private timerId__?: number | NodeJS.Timeout;

  /**
   * The timer ID for the `maxWait` functionality.
   * @private
   */
  private maxWaitTimerId__?: number | NodeJS.Timeout;

  /**
   * The arguments from the last `trigger` call.
   * @private
   */
  private lastArgs__?: Parameters<F>;

  /**
   * Constructs a new Debouncer instance.
   *
   * @param {DebouncerConfig<F>} config__ - The configuration for the debouncer.
   */
  public constructor(private readonly config__: DebouncerConfig<F>) {
    this.config__.trailing ??= true;
    this.flush = this.flush.bind(this);
  }

  /**
   * Checks if there is a pending debounced execution scheduled.
   *
   * @returns {boolean} `true` if a timer is active, otherwise `false`.
   */
  public get isPending(): boolean {
    return this.timerId__ !== undefined;
  }

  /**
   * Triggers the debounced function.
   *
   * When called, it will schedule the function to run after the specified `delay`.
   * Each subsequent call within the delay period will reset the timer.
   *
   * @param {...Parameters<F>} args - The arguments to pass to the debounced function.
   *
   * @example
   * ```ts
   * const debouncer = new Debouncer({
   *   func: (a: number, b: string) => console.log(`Args: ${a}, ${b}`),
   *   delay: 500,
   * });
   *
   * debouncer.trigger(1, 'a');
   * debouncer.trigger(2, 'b'); // This will execute after 500ms.
   * ```
   */
  public trigger(...args: Parameters<F>): void {
    this.lastArgs__ = args;
    const firstTrigger = !this.isPending;

    if (firstTrigger) {
      if (this.config__.maxWait) {
        this.maxWaitTimerId__ = setTimeout(this.flush, this.config__.maxWait);
      }
      if (this.config__.leading === true) {
        this.invoke__();
      }
    }
    else {
      clearTimeout(this.timerId__!);
    }

    this.timerId__ = setTimeout(() => {
      if (this.config__.trailing === true) {
        this.invoke__();
      }
      this.cleanup__();
    }, this.config__.delay);
  }

  /**
   * Cancels any pending debounced execution.
   *
   * This is useful for cleanup, e.g., in a component's lifecycle `unmount` method.
   *
   * @example
   * ```ts
   * const debouncer = new Debouncer({
   *   func: () => console.log('This will not be executed.'),
   *   delay: 1000,
   * });
   *
   * debouncer.trigger();
   * debouncer.cancel();
   *
   * console.log(debouncer.isPending); // false
   * ```
   */
  public cancel(): void {
    if (this.timerId__) {
      clearTimeout(this.timerId__);
    }
    if (this.maxWaitTimerId__) {
      clearTimeout(this.maxWaitTimerId__);
    }
    this.cleanup__();
  }

  /**
   * Resets the internal state of the debouncer.
   * @private
   */
  private cleanup__(): void {
    delete this.timerId__;
    delete this.maxWaitTimerId__;
    delete this.lastArgs__;
  }

  /**
   * Immediately executes the pending debounced function if one exists.
   *
   * This bypasses the delay and then cancels any scheduled execution.
   * If no pending call exists, this method does nothing.
   *
   * @example
   * ```ts
   * const debouncer = new Debouncer({
   *   func: (val: number) => console.log(`Flushed with: ${val}`),
   *   delay: 1000,
   * });
   *
   * debouncer.trigger(42);
   * // Before the 1000ms delay passes:
   * debouncer.flush(); // Logs "Flushed with: 42" immediately.
   *
   * console.log(debouncer.isPending); // false
   * ```
   */
  public flush(): void {
    if (this.isPending) {
      this.invoke__();
    }
    this.cancel();
  }

  /**
   * The core execution logic that calls the debounced function.
   * @private
   */
  private invoke__(): void {
    // Only call if we have new args (e.g., skip trailing call if leading already called with same args)
    if (this.lastArgs__) {
      this.config__.func.apply(this.config__.thisContext, this.lastArgs__);
      this.lastArgs__ = undefined;
    }
  }
}
