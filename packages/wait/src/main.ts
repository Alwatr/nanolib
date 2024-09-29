import { requestAnimationFrame, requestIdleCallback } from './polyfill.js';

import type { HasAddEventListener } from '@alwatr/type-helper';

/**
 * A utility module to help manage asynchronous operations and waiting for events.
 */
export const wait = {
  /**
   * Wait for a specified duration (in milliseconds).
   *
   * @param duration - The duration to wait (in milliseconds). Use `0` to yield control to the event loop.
   * @returns A Promise that resolves after the specified duration.
   *
   * @example
   * ```typescript
   * await wait.timeout(1000); // Wait for 1 second
   * await wait.timeout(0); // Yield control to the event loop
   * ```
   */
  timeout: (duration: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, duration)),

  /**
   * Wait for the next animation frame.
   *
   * @returns A Promise that resolves with the current timestamp when the next animation frame is fired.
   *
   * @example
   * ```typescript
   * const timestamp = await wait.animationFrame();
   * ```
   */
  animationFrame: (): Promise<DOMHighResTimeStamp> =>
    new Promise((resolve) => requestAnimationFrame(resolve)),

  /**
   * Wait for the browser's idle period.
   *
   * @param timeout - Optional timeout (in milliseconds) for the idle callback.
   * @returns A Promise that resolves with the IdleDeadline object when the browser is idle.
   *
   * @example
   * ```typescript
   * const deadline = await wait.idle();
   * ```
   */
  idle: (timeout?: number): Promise<IdleDeadline> =>
    new Promise((resolve) => requestIdleCallback(resolve, { timeout })),

  /**
   * Wait for a specific DOM event on an HTMLElement.
   *
   * @param element - The HTMLElement to listen for the event on.
   * @param eventName - The name of the DOM event to wait for.
   * @template T The event map type.
   * @returns A Promise that resolves with the event object when the specified event occurs.
   *
   * @example
   * ```typescript
   * const clickEvent = await wait.domEvent(document.body, 'click');
   * ```
   */
  domEvent: <T extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    eventName: T
  ): Promise<HTMLElementEventMap[T]> =>
    new Promise((resolve) =>
      element.addEventListener(eventName, resolve, { once: true, passive: true })
    ),

  /**
   * Wait for a specific event on an object with an `addEventListener` method.
   *
   * @param target - The target object to listen for the event on.
   * @param eventName - The name of the event to wait for.
   * @returns A Promise that resolves with the event object when the specified event occurs.
   *
   * @example
   * ```typescript
   * const server = http.createServer();
   * const requestEvent = await wait.event(server, 'request');
   * ```
   */
  event: (target: HasAddEventListener, eventName: string): Promise<Event> =>
    new Promise((resolve) =>
      target.addEventListener(eventName, resolve, { once: true, passive: true })
    ),


  /**
   * Yield control to the event loop immediately.
   *
   * Uses `setImmediate` if available, falls back to `queueMicrotask`, and then to `setTimeout(0)`.
   *
   * @returns A Promise that resolves immediately after yielding control to the event loop.
   *
   * @example
   * ```typescript
   * await wait.immediate();
   * ```
   */
  immediate: (): Promise<void> => {
    if (typeof setImmediate !== 'function') {
      if (typeof queueMicrotask === 'function') {
        return wait.microtask();
      }

      // else
      return wait.timeout(0);
    }
    return new Promise((resolve) => setImmediate(resolve));
  },

  /**
   * Wait for the next microtask to complete.
   *
   * @returns A Promise that resolves when the next microtask queue is empty.
   *
   * @example
   * ```typescript
   * await wait.microtask();
   * ```
   */
  microtask: (): Promise<void> => {
    if (typeof queueMicrotask !== 'function') {
      if (typeof setImmediate === 'function') {
        return wait.immediate();
      }

      // else
      return wait.timeout(0);
    }
    return new Promise((resolve) => queueMicrotask(resolve));
  },

} as const;
