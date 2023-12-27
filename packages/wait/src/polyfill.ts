import {globalScope as globalScope_} from '@alwatr/global-scope';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalScope = globalScope_ as Record<string, any>;

const requestAnimationFrameFallback = (callback: FrameRequestCallback): ReturnType<typeof setTimeout> =>
  setTimeout(() => callback(Date.now()), 1000 / 60);

export const requestAnimationFrame: typeof globalScope.requestAnimationFrame =
  globalScope.requestAnimationFrame ||
  globalScope.webkitRequestAnimationFrame ||
  globalScope.mozRequestAnimationFrame ||
  requestAnimationFrameFallback;

const requestIdleCallbackFallback = (callback: () => void, options?: IdleRequestOptions): ReturnType<typeof setTimeout> =>
  setTimeout(callback, options?.timeout ?? 2000);

export const requestIdleCallback: typeof globalScope.requestIdleCallback =
  globalScope.requestIdleCallback ||
  globalScope.webkitRequestIdleCallback ||
  globalScope.mozRequestIdleCallback ||
  requestIdleCallbackFallback;
