import {requestAnimationFrame} from './polyfill';

import type {HasAddEventListener} from '@alwatr/type-helper';

/**
 * Wait for a given duration.
 * Use `zero` for deferring the execution of a function until the call stack is clear.
 *
 * @param duration The duration to wait for.
 * @example
 * ```ts
 * await waitForTimeout(1000);
 * ```
 * TODO: parse string duration using @alwatr/parse-duration.
 */
export function waitForTimeout(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Wait for the next animation frame.
 * Animation frames are tasks that are executed before the next frame is rendered.
 *
 * @returns A promise that resolves with the current time.
 * @example
 * ```ts
 * await waitForAnimationFrame();
 * ```
 */
export function waitForAnimationFrame(): Promise<DOMHighResTimeStamp> {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Wait for the next idle callback.
 * Idle callbacks are tasks that are executed when the browser is idle.
 *
 * @param timeout The maximum time to wait for.
 * @returns A promise that resolves with the current time.
 * @example
 * ```ts
 * await waitForIdle();
 * ```
 */
export function waitForIdle(timeout?: number): Promise<IdleDeadline> {
  return new Promise((resolve) => requestIdleCallback(resolve, {timeout}));
}

/**
 * Wait for a DOM event to be dispatched.
 *
 * @param element The element to listen on.
 * @param eventName The event name to listen for.
 * @template T The event map type.
 * @returns A promise that resolves with the event.
 * @example
 * ```ts
 * await waitForDomEvent(document.body, 'click');
 * ```
 */
export function waitForDomEvent<T extends keyof HTMLElementEventMap>(element: HTMLElement, eventName: T): Promise<HTMLElementEventMap[T]> {
  return new Promise((resolve) => element.addEventListener(eventName, resolve, {once: true, passive: true}));
}

/**
 * Wait for a event to be dispatched.
 *
 * @param target The target to listen on.
 * @param eventName The event name to listen for.
 * @returns A promise that resolves with the event.
 * @example
 * ```ts
 * const sever = http.createServer();
 * await waitForEvent(sever, 'request');
 * ```
 */
export function waitForEvent(target: HasAddEventListener, eventName: string): Promise<Event> {
  return new Promise((resolve) => {
    target.addEventListener(eventName, resolve, {once: true, passive: true});
  });
}

/**
 * Wait immediate.
 * If `setImmediate` is not available, use `queueMicrotask` and if that is not available, use `setTimeout`.
 *
 * @example
 * ```ts
 * await waitForImmediate();
 * ```
 */
export function waitForImmediate(): Promise<void> {
  if (typeof setImmediate !== 'function') {
    if (typeof queueMicrotask === 'function') {
      return waitForMicrotask();
    }

    // else
    return waitForTimeout(0);
  }
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Wait for the next microtask queue.
 * Microtasks are tasks that are executed after the current task and before the next task.
 *
 * @example
 * ```ts
 * await waitForMicrotask();
 * ```
 */
export function waitForMicrotask(): Promise<void> {
  if (typeof queueMicrotask !== 'function') {
    if (typeof setImmediate === 'function') {
      return waitForImmediate();
    }

    // else
    return waitForTimeout(0);
  }
  return new Promise((resolve) => queueMicrotask(resolve));
}
