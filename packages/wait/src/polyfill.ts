import {globalScope} from '@alwatr/global-scope';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const win = globalScope as Record<string, any>;

const requestAnimationFrameFallback = (callback: FrameRequestCallback): ReturnType<typeof setTimeout> =>
  setTimeout(() => callback(Date.now()), 1000 / 60);

export const requestAnimationFrame: typeof globalScope.requestAnimationFrame =
  win.requestAnimationFrame ||
  win.webkitRequestAnimationFrame ||
  win.mozRequestAnimationFrame ||
  requestAnimationFrameFallback;

const requestIdleCallbackFallback = (callback: () => void, options?: IdleRequestOptions): ReturnType<typeof setTimeout> =>
  setTimeout(callback, options?.timeout ?? 2000);

export const requestIdleCallback: typeof globalScope.requestIdleCallback =
  win.requestIdleCallback ||
  win.webkitRequestIdleCallback ||
  win.mozRequestIdleCallback ||
  requestIdleCallbackFallback;
