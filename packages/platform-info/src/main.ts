/**
 * Represents information about the current platform.
 */
interface PlatformInfo {
  /**
   * The current platform name.
   * - `browser` for browsers.
   * - `node` for node.js environments.
   * - `semi-node` for node.js like environments such as nw.js, deno, etc.
   * - `unknown` for unknown environments.
   */
  name: 'browser' | 'node' | 'semi-node' | 'unknown';

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
   * Whether the current platform is deno.
   */
  isDeno: boolean;

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
const platformInfo: PlatformInfo = {
  name: 'unknown',
  development: false,
  isNode: false,
  isBrowser: false,
  isDeno: false,
  isNw: false,
  isElectron: false,
};

if (typeof window === 'object' && typeof document === 'object' && document.nodeType === Node.DOCUMENT_NODE) {
  platformInfo.name = 'browser';
  platformInfo.isBrowser = true;
}
else if (process.versions?.node != null) {
  platformInfo.name = 'node';
  platformInfo.isNode = true;
}
else if (typeof process === 'object') {
  platformInfo.name = 'semi-node';

  if (process.versions?.electron != null) {
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
  platformInfo.isDeno = true;
}

// development
if (platformInfo.isBrowser) {
  platformInfo.development = location.hostname === 'localhost' || location.hostname.indexOf('127.') === 0;
}
else if (platformInfo.name === 'semi-node') {
  platformInfo.development = process.env.NODE_ENV !== 'production';
}
