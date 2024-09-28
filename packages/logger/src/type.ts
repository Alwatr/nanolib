/**
 * Represents the AlwatrLogger interface.
 * The AlwatrLogger provides methods for logging various types of information.
 */
export interface AlwatrLogger {
  /**
   * Debug state for current scope base on localStorage `ALWATR_LOG` pattern.
   */
  debugMode: boolean;

  /**
   * `console.debug` property change.
   *
   * Example:
   *
   * ```ts
   * logger.logProperty?.('name', 'ali');
   * ```
   */
  logProperty?(property: string, value: unknown): void;

  /**
   * `console.debug` module file name.
   *
   * Example:
   *
   * ```ts
   * logger.logFileModule?.('app');
   * ```
   */
  logFileModule?(fileName: string): void;

  /**
   * `console.debug` function or method calls.
   *
   * Example:
   *
   * ```ts
   * function myMethod () {
   *   logger.logMethod?.('myMethod');
   * }
   * ```
   */
  logMethod?(method: string): void;

  /**
   * `console.debug` function or method calls with arguments.
   *
   * Example:
   *
   * ```ts
   * function myMethod (a: number, b: number) {
   *   logger.logMethodArgs?.('myMethod', {a, b});
   * }
   * ```
   */

  /**
   * `console.debug` steps in a method.
   *
   * Example:
   *
   * ```ts
   * function myMethod () {
   *   logger.logMethod?.('myMethod');
   *   ...
   *   logger.logStep?.('myMethod', 'step1');
   *   ...
   *   logger.logStep?.('myMethod', 'step2');
   *   ...
   * }
   * ```
   */
  logStep?(methodName: string, stepName: string, props?: unknown): void;

  /**
   * `console.debug` function or method calls with arguments.
   *
   * Example:
   *
   * ```ts
   * function add (a: number, b: number): number {
   *   const result = a + b;
   *   logger.logMethodFull?.('add', {a, b}, result);
   *   return result;
   * }
   * ```
   */
  logMethodFull?(method: string, args: unknown, result: unknown): void;

  /**
   * `console.log` an event or expected accident.
   * not warn or error just important information.
   *
   * Example:
   *
   * ```ts
   * logger.incident?.('fetch', 'abort_signal', {url: '/test.json'});
   * ```
   */
  incident?(method: string, code: string, ...args: unknown[]): void;

  /**
   * `console.warn` an unexpected accident or error that you handled like warning.
   *
   * Example:
   *
   * ```ts
   * logger.accident('fetch', 'file_not_found', {url: '/test.json'});
   * ```
   */
  accident(method: string, code: string, ...args: unknown[]): void;

  /**
   * `console.error` an unexpected error.
   *
   * Example:
   *
   * ```ts
   * try {
   *   ...
   * }
   * catch (err) {
   *   logger.error('myMethod', 'error_code', err, {a: 1, b: 2});
   * }
   * ```
   */
  error(method: string, code: string, ...args: unknown[]): void;

  /**
   * Simple `console.debug` with styled scope.
   *
   * Example:
   *
   * ```ts
   * logger.logOther?.('foo:', 'bar', {a: 1});
   * ```
   */
  logOther?(...args: unknown[]): void;

  /**
   * Simple `console.time` with scope.
   *
   * Example:
   *
   * ```ts
   * logger.time?.('foo');
   * ```
   */
  time?(label: string): void;

  /**
   * Simple `console.timeEnd` with scope.
   *
   * Example:
   *
   * ```ts
   * logger.timeEnd?.('foo');
   * ```
   */
  timeEnd?(label: string): void;

  /**
   * log big banner
   *
   * Example:
   *
   * ```ts
   * logger.banner('Alwatr PWA v2');
   * ```
   */
  banner(message: string): void;
}
