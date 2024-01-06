import {definePackage as definePackage_} from '@alwatr/dedupe';

import {createLogger} from './logger.js';

import type {AlwatrLogger} from './type.js';

/**
 * Global define package for managing package versions to prevent version conflicts and return package level logger.
 * @param packageName package name including scope. e.g. `@scope/package-name`
 * @param version package version (optional)
 * @returns AlwatrLogger for the package
 *
 * @example
 * ```typescript
 * const logger = definePackage('@scope/package-name', __package_version__);
 *
 * logger.logMethodArgs?.('myMethod', {a, b});
 * ```
 */
export function definePackage(packageName: string, version = 'v?'): AlwatrLogger {
  const logger = createLogger(`{${packageName}}`);
  logger.logMethodArgs?.('define-package', {packageName, version});
  definePackage_(packageName, version);
  return logger;
}
