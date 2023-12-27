import {globalScope} from '@alwatr/global-scope';

import {requestAnimationFrame} from './polyfill';

/**
 * Wait for a given duration.
 * Use `zero` to wait for the next tick.
 *
 * @param duration The duration to wait for.
 * @example
 * ```ts
 * await waitForTime(1000);
 * ```
 */
export function waitForTime(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Wait for the next animation frame.
 * Animation frames are tasks that are executed before the next frame is rendered.
 *
 * @returns A promise that resolves with the current time.
 * @example
 * ```ts
 * await waitForNextFrame();
 * ```
 */
export function waitForNextFrame(): Promise<DOMHighResTimeStamp> {
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
 * await waitForNextFrame();
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
 * Wait for a DOM event to be dispatched.
 *
 * @param eventName The event name to listen for.
 * @returns A promise that resolves with the event.
 * @example
 * ```ts
 * await waitForEvent('click');
 * ```
 */
export function waitForEvent(eventName: string): Promise<Event> {
  return new Promise((resolve) => {
    globalScope.addEventListener(eventName, resolve, {once: true, passive: true});
  });
}

/**
 * Wait immediate.
 * If `setImmediate` is not available, it will wait for 0 time.
 *
 * @example
 * ```ts
 * await waitForImmediate();
 * ```
 */
export function waitForImmediate(): Promise<void> {
  if (typeof setImmediate !== 'function') {
    return waitForTime(0);
  }
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Wait for the next tick.
 *
 * @example
 * ```ts
 * await waitForNextTick();
 * ```
 */
export function waitForNextTick(): Promise<void> {
  return new Promise((resolve) => process.nextTick(resolve));
}

/**
 * Wait for the next microtask.
 * Microtasks are tasks that are executed after the current task and before the next task.
 *
 * @example
 * ```ts
 * await waitForMicrotask();
 * ```
 */
export function waitForMicrotask(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(resolve));
}
