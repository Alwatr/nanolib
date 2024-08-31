import type {Dictionary} from '@alwatr/type-helper';

declare global {
  // eslint-disable-next-line no-var
  var __alwatr_dedupe__: true;

  // eslint-disable-next-line no-var
  var __package_version__: string;
}

const globalScope: typeof globalThis =
  (typeof globalThis === 'object' && globalThis) ||
  (typeof window === 'object' && window) ||
  (typeof global === 'object' && global) ||
  self;

if (typeof globalScope.__alwatr_dedupe__ === 'undefined') {
  globalScope.__alwatr_dedupe__ = true;
}
else {
  console.error('duplicate_alwatr_dedupe', {version: __package_version__});
}

export const definedPackageList: Dictionary<string> = {};

/**
 * Global define package for managing package versions to prevent version conflicts.
 * @param packageName package name including scope. e.g. `@scope/package-name`
 * @param version package version (optional)
 *
 * @example
 * ```typescript
 * definePackage('@scope/package-name', __package_version__);
 * ```
 */
export function definePackage(packageName: string, version = 'v?'): void {
  if (Object.prototype.hasOwnProperty.call(definedPackageList, packageName)) {
    console.error(
      new Error('duplicate_package', {
        cause: {
          packageName,
          newVersion: version,
          oldVersion: definedPackageList[packageName],
        },
      }),
    );
  }

  definedPackageList[packageName] = version;
}

definePackage('@alwatr/dedupe', __package_version__);
