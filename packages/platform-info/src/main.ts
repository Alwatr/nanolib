/**
 * Represents information about the current platform.
 */
interface PlatformInfo {
  /**
   * Whether the NODE_ENV environment variable is not `production` or in browser location.hostname is `localhost`.
   */
  development: boolean;

  /**
   * Whether the current platform is node.js.
   */
  isNode: boolean;

  /**
   * Whether the current platform is a browser.
   */
  isBrowser: boolean;

  /**
   * Whether the current platform is a not a browser.
   */
  isCli: boolean;

  /**
   * Whether the current platform is a web worker.
   */
  isWebWorker: boolean;

  /**
   * Whether the current platform is deno.
   */
  isDeno: boolean;

  /**
   * Whether the current platform is bun.
   */
  isBun: boolean;

  /**
   * Whether the current platform is nw.js.
   */
  isNw: boolean;

  /**
   * Whether the current platform is electron.
   */
  isElectron: boolean;
}

/**
 * Represents information about the current platform.
 */
export const platformInfo: PlatformInfo = {
  development: false,
  isNode: false,
  isBrowser: false,
  isWebWorker: false,
  isDeno: false,
  isBun: false,
  isCli: false,
  isNw: false,
  isElectron: false,
};

if (typeof window === 'object' && typeof document === 'object' && document.nodeType === Node.DOCUMENT_NODE) {
  platformInfo.isBrowser = true;
  // @ts-expect-error - Cannot find name 'WorkerGlobalScope'
  platformInfo.isWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
}
else if (typeof process === 'object') {
  platformInfo.isCli = true;

  if (process.versions?.node != null) {
    platformInfo.isNode = true;
  }

  // @ts-expect-error - Cannot find name 'Bun'
  if (typeof Bun !== 'undefined') {
    platformInfo.isBun = true;
  }
  else if (process.versions?.electron != null) {
    platformInfo.isElectron = true;
  }
  // @ts-expect-error - Cannot find name 'nw'
  else if (typeof nw !== 'undefined') {
    platformInfo.isNw = true;
  }
}

// other platforms
// @ts-expect-error - Cannot find name 'Deno'
if (typeof Deno !== 'undefined') {
  platformInfo.isCli = true;
  platformInfo.isDeno = true;
}

// development
if (platformInfo.isBrowser === true) {
  platformInfo.development = location.hostname === 'localhost' || location.hostname.indexOf('127.') === 0;
}
else if (platformInfo.isCli === true) {
  platformInfo.development = process.env.NODE_ENV !== 'production';
}
