import {packageTracer} from '@alwatr/package-tracer';
import {parseDuration, type Duration} from '@alwatr/parse-duration';

packageTracer.add(__package_name__, __package_version__);

import {requestAnimationFrame, requestIdleCallback} from './polyfill.js';

import type {HasAddEventListener} from '@alwatr/type-helper';

/**
 * A utility module to help manage asynchronous operations and waiting for events or timeouts.
 */
export const delay = {
  /**
   * Delays execution for a specified duration (in milliseconds).
   *
   * @param duration - The duration to wait (in milliseconds). Use `0` to yield control to the event loop.
   * @returns A Promise that resolves after the specified duration.
   *
   * @example
   * ```typescript
   * await delay.by('1m'); // Wait for 1 minute
   * ```
   */
  by: (duration: Duration): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, parseDuration(duration))),

  /**
   * Delays execution until the next animation frame.
   *
   * @returns A Promise that resolves with the current timestamp when the next animation frame is fired.
   *
   * @example
   * ```typescript
   * const timestamp = await delay.untilNextAnimationFrame();
   * ```
   */
  untilNextAnimationFrame: (): Promise<DOMHighResTimeStamp> =>
    new Promise((resolve) => requestAnimationFrame(resolve)),

  /**
   * Delays execution until the browser's idle period or the specified timeout.
   *
   * @param timeout - Optional timeout (in milliseconds) for the idle callback.
   * @returns A Promise that resolves with the IdleDeadline object when the browser is idle or the timeout is reached.
   *
   * @example
   * ```typescript
   * const deadline = await delay.untilIdle();
   * ```
   */
  untilIdle: (timeout?: Duration): Promise<IdleDeadline> =>
    new Promise((resolve) => requestIdleCallback(resolve, timeout === undefined ? undefined : {
      timeout: parseDuration(timeout)
    })),

  /**
   * Delays execution until a specific DOM event occurs on an HTMLElement.
   *
   * @param element - The HTMLElement to listen for the event on.
   * @param eventName - The name of the DOM event to wait for.
   * @template T The event map type.
   * @returns A Promise that resolves with the event object when the specified event occurs.
   *
   * @example
   * ```typescript
   * const clickEvent = await delay.untilDomEvent(document.body, 'click');
   * ```
   */
  untilDomEvent: <T extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    eventName: T
  ): Promise<HTMLElementEventMap[T]> =>
    new Promise((resolve) =>
      element.addEventListener(eventName, resolve, { once: true, passive: true })
    ),

  /**
   * Delays execution until a specific event occurs on an object with an `addEventListener` method.
   *
   * @param target - The target object to listen for the event on.
   * @param eventName - The name of the event to wait for.
   * @returns A Promise that resolves with the event object when the specified event occurs.
   *
   * @example
   * ```typescript
   * const server = http.createServer();
   * const requestEvent = await delay.untilEvent(server, 'request');
   * ```
   */
  untilEvent: (target: HasAddEventListener, eventName: string): Promise<Event> =>
    new Promise((resolve) =>
      target.addEventListener(eventName, resolve, { once: true, passive: true })
    ),

  /**
   * Yields control to the event loop immediately.
   *
   * Uses `setImmediate` if available, falls back to `queueMicrotask`, and then to `setTimeout(0)`.
   *
   * @returns A Promise that resolves immediately after yielding control to the event loop.
   *
   * @example
   * ```typescript
   * await delay.immediate();
   * ```
   */
  immediate: (): Promise<void> => {
    if (typeof setImmediate !== 'function') {
      if (typeof queueMicrotask === 'function') {
        return delay.nextMicrotask();
      }

      // else
      return delay.by(0);
    }
    return new Promise((resolve) => setImmediate(resolve));
  },

  /**
   * Delays execution until the next microtask queue is empty
   *
   * @returns A Promise that resolves when the next microtask queue is empty.
   *
   * @example
   * ```typescript
   * await delay.nextMicrotask();
   * ```
   */
  nextMicrotask: (): Promise<void> => {
    if (typeof queueMicrotask !== 'function') {
      if (typeof setImmediate === 'function') {
        return delay.immediate();
      }

      // else
      return delay.by(0);
    }
    return new Promise((resolve) => queueMicrotask(resolve));
  },
} as const;
