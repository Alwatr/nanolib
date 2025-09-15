/**
 * An interface representing detailed information about the current JavaScript runtime environment.
 */
interface PlatformInfo {
  /**
   * `true` if the code is running in a development environment.
   * In browsers, this is `true` for `localhost`.
   * In CLI environments (like Node.js), this is `true` if `process.env.NODE_ENV` is not 'production'.
   */
  readonly development: boolean;

  /**
   * `true` if the current runtime is Node.js.
   */
  readonly isNode: boolean;

  /**
   * `true` if the current runtime is a web browser.
   */
  readonly isBrowser: boolean;

  /**
   * `true` if the current runtime is a command-line interface (CLI), such as Node.js, Deno, or Bun.
   */
  readonly isCli: boolean;

  /**
   * `true` if the current runtime is a Web Worker.
   */
  readonly isWebWorker: boolean;

  /**
   * `true` if the current runtime is Deno.
   */
  readonly isDeno: boolean;

  /**
   * `true` if the current runtime is Bun.
   */
  readonly isBun: boolean;

  /**
   * `true` if the current runtime is NW.js.
   */
  readonly isNw: boolean;

  /**
   * `true` if the current runtime is Electron.
   */
  readonly isElectron: boolean;
}

/**
 * A frozen object containing detailed information about the current JavaScript runtime environment.
 * This utility detects whether the code is running in a browser, Node.js, Deno, Bun, or other environments.
 *
 * @example
 * ```ts
 * import { platformInfo } from '@alwatr/platform-info';
 *
 * if (platformInfo.isBrowser) {
 *   console.log('Running in a browser.');
 *   if (platformInfo.development) {
 *     console.log('Development mode is enabled.');
 *   }
 * } else if (platformInfo.isNode) {
 *   console.log('Running on Node.js.');
 * }
 * ```
 */
export const platformInfo: PlatformInfo = /* #__PURE__ */ (() => {
  const platformInfo_: Mutable<PlatformInfo> = {
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
    platformInfo_.isBrowser = true;
    // @ts-expect-error - `WorkerGlobalScope` is not defined in all environments.
    platformInfo_.isWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
  }
  else if (typeof process === 'object') {
    platformInfo_.isCli = true;

    if (process.versions?.node != null) {
      platformInfo_.isNode = true;
    }

    // @ts-expect-error - `Bun` is not defined in all environments.
    if (typeof Bun !== 'undefined') {
      platformInfo_.isBun = true;
    }
    else if (process.versions?.electron != null) {
      platformInfo_.isElectron = true;
    }
    // @ts-expect-error - `nw` is not defined in all environments.
    else if (typeof nw !== 'undefined') {
      platformInfo_.isNw = true;
    }
  }

  // @ts-expect-error - `Deno` is not defined in all environments.
  if (typeof Deno !== 'undefined') {
    platformInfo_.isCli = true;
    platformInfo_.isDeno = true;
  }

  // Determine development mode
  if (platformInfo_.isBrowser === true) {
    platformInfo_.development = location.hostname === 'localhost' || location.hostname.indexOf('127.') === 0;
  }
  else if (platformInfo_.isCli === true) {
    platformInfo_.development = process.env.NODE_ENV !== 'production';
  }

  return platformInfo_;
})();
