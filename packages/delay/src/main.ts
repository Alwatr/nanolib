import {parseDuration, type Duration} from '@alwatr/parse-duration';

import {requestAnimationFrame, requestIdleCallback} from './polyfill.js';

export {requestAnimationFrame, requestIdleCallback};

/**
 * A collection of utility functions for managing asynchronous delays and waiting for various events.
 * This can be useful for orchestrating animations, handling user input, and managing task execution order.
 */
export const delay = {
  /**
   * Pauses execution for a specified duration.
   *
   * @param {Duration} duration - The duration to wait. It can be a number in milliseconds or a string (e.g., '2s', '100ms').
   * @returns {Promise<void>} A promise that resolves after the specified duration has passed.
   *
   * @example
   * ```ts
   * console.log('Waiting for 2 seconds...');
   * await delay.by('2s');
   * console.log('2 seconds have passed.');
   *
   * await delay.by(500); // Wait for 500ms
   * ```
   */
  by: (duration: Duration): Promise<void> => new Promise((resolve) => setTimeout(resolve, parseDuration(duration))),

  /**
   * Pauses execution until the next browser animation frame.
   *
   * @returns {Promise<DOMHighResTimeStamp>} A promise that resolves with the high-resolution timestamp of the next frame.
   *
   * @example
   * ```ts
   * async function animate() {
   *   const timestamp = await delay.animationFrame();
   *   console.log(`Animating at timestamp: ${timestamp}`);
   *   // Update animation state here
   *   requestAnimationFrame(animate);
   * }
   * animate();
   * ```
   */
  animationFrame: (): Promise<DOMHighResTimeStamp> => new Promise((resolve) => requestAnimationFrame(resolve)),

  /**
   * Pauses execution until the browser is idle.
   *
   * @param {IdleRequestOptions} [options] - Optional parameters, such as a timeout.
   * @returns {Promise<IdleDeadline>} A promise that resolves with an `IdleDeadline` object.
   *
   * @example
   * ```ts
   * async function doWorkWhenIdle() {
   *   const deadline = await delay.idleCallback({ timeout: 2000 });
   *   if (deadline.didTimeout) {
   *     console.log('Idle callback timed out.');
   *   } else {
   *     console.log(`Idle time remaining: ${deadline.timeRemaining()}ms`);
   *     // Perform non-critical background work here
   *   }
   * }
   * ```
   */
  idleCallback: (options?: IdleRequestOptions): Promise<IdleDeadline> =>
    new Promise((resolve) => requestIdleCallback(resolve, options)),

  /**
   * Pauses execution until a specific DOM event is dispatched on an element.
   *
   * @template T - The event map type for the element.
   * @param {HTMLElement} element - The HTML element to listen on.
   * @param {T} eventName - The name of the event to wait for (e.g., 'click', 'load').
   * @param {AddEventListenerOptions} [options={passive: true}] - Optional event listener options.
   * @returns {Promise<HTMLElementEventMap[T]>} A promise that resolves with the triggered event object.
   *
   * @example
   * ```ts
   * const button = document.getElementById('my-button');
   * if (button) {
   *   console.log('Waiting for button click...');
   *   const clickEvent = await delay.domEvent(button, 'click');
   *   console.log('Button clicked!', clickEvent);
   * }
   * ```
   */
  domEvent: <T extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    eventName: T,
    options: AddEventListenerOptions = {passive: true},
  ): Promise<HTMLElementEventMap[T]> =>
    new Promise((resolve) =>
      element.addEventListener(eventName, resolve, {
        ...options,
        once: true,
      }),
    ),

  /**
   * Pauses execution until a specific event is dispatched on any `EventTarget`.
   *
   * @param {EventTarget} target - The event target (e.g., `window`, `document`, or a custom event emitter).
   * @param {string} eventName - The name of the event to wait for.
   * @param {AddEventListenerOptions} [options={passive: true}] - Optional event listener options.
   * @returns {Promise<Event>} A promise that resolves with the triggered event object.
   *
   * @example
   * ```ts
   * console.log('Waiting for window resize...');
   * const resizeEvent = await delay.event(window, 'resize');
   * console.log('Window resized:', resizeEvent);
   * ```
   */
  event: (target: EventTarget, eventName: string, options: AddEventListenerOptions = {passive: true}): Promise<Event> =>
    new Promise((resolve) =>
      target.addEventListener(eventName, resolve, {
        ...options,
        once: true,
      }),
    ),

  /**
   * Schedules a macrotask to run after the current event loop task completes.
   * This is typically done using `setTimeout(..., 0)`.
   *
   * @returns {Promise<void>} A promise that resolves when the macrotask is executed.
   *
   * @example
   * ```ts
   * console.log('A: Start of the current task');
   * delay.nextMacrotask().then(() => console.log('C: Executed in a new macrotask'));
   * console.log('B: End of the current task');
   * // Output order: A, B, C
   * ```
   */
  nextMacrotask: (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0)),

  /**
   * Queues a microtask to run after the current task completes but before the next macrotask.
   * Microtasks are executed immediately after the current script finishes.
   *
   * @returns {Promise<void>} A promise that resolves when the microtask is executed.
   *
   * @example
   * ```ts
   * console.log('A: Start of the current task');
   * delay.nextMicrotask().then(() => console.log('C: Executed in a microtask'));
   * console.log('B: End of the current task');
   * // Output order: A, B, C
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  nextMicrotask: (): Promise<void> => Promise.resolve().then(() => {}),
} as const;
