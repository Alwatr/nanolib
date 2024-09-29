import {globalScope} from '@alwatr/global-scope';

import type {DictionaryOpt} from '@alwatr/type-helper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const win = globalScope as DictionaryOpt<any>;

// prettier-ignore
const requestAnimationFrameFallback =
  (callback: FrameRequestCallback): ReturnType<typeof setTimeout> =>
    setTimeout(() => callback(Date.now()), 1000 / 60);

// prettier-ignore
export const requestAnimationFrame: typeof globalScope.requestAnimationFrame =
  win.requestAnimationFrame ||
  win.webkitRequestAnimationFrame ||
  win.mozRequestAnimationFrame ||
  requestAnimationFrameFallback;

// prettier-ignore
const requestIdleCallbackFallback =
  (callback: () => void, options?: IdleRequestOptions): ReturnType<typeof setTimeout> =>
    setTimeout(callback, options?.timeout ?? 2000);

// prettier-ignore
export const requestIdleCallback: typeof globalScope.requestIdleCallback =
  win.requestIdleCallback ||
  win.webkitRequestIdleCallback ||
  win.mozRequestIdleCallback ||
  requestIdleCallbackFallback;
