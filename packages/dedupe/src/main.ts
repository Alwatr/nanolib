import {getGlobalThis} from '@alwatr/global-this';
import '@alwatr/polyfill-has-own';

/**
 * A global variable to track the loaded version of the `@alwatr/dedupe` package itself.
 * This helps in detecting if multiple, potentially incompatible, versions of this utility are running.
 * @private
 */
const globalThis_ = getGlobalThis<{__alwatr_dedupe__: string | true}>();

// Self-deduplication check for the @alwatr/dedupe package.
if (typeof globalThis_.__alwatr_dedupe__ === 'undefined') {
  globalThis_.__alwatr_dedupe__ = __package_version__;
}
else {
  // If a version is already registered, log an error.
  if (globalThis_.__alwatr_dedupe__ === true) {
    // Handle cases where the previously loaded version was from an older, incompatible dedupe version.
    globalThis_.__alwatr_dedupe__ = '1.0.x';
  }

  console.error(
    new Error('duplication_detected', {
      cause: {
        name: __package_name__,
        oldVersion: globalThis_.__alwatr_dedupe__,
        newVersion: __package_version__,
      },
    }),
  );
}

/**
 * A private record to keep track of deduplicated package names.
 * @private
 */
const list: DictionaryOpt<true> = {};

/**
 * Prevents the duplication of entities, such as Node.js packages, in a project.
 *
 * This function checks if an entity with the given name has already been registered.
 * If it has, it either throws an error (in strict mode) or logs an error to the console.
 * This is useful for ensuring that only one version of a package is loaded at runtime,
 * preventing potential version conflicts and bugs.
 *
 * @param {{name: string; strict?: true}} args - The arguments for deduplication.
 * @param {string} args.name - The name of the entity to deduplicate (e.g., a package name like `@scope/package-name`).
 * @param {boolean} [args.strict=false] - If `true`, the function will throw an error on duplication. Otherwise, it will log an error.
 *
 * @example
 * ```ts
 * // In a package's main entry file:
 * import { deduplicate } from '@alwatr/dedupe';
 *
 * // Basic usage (logs an error on duplication)
 * deduplicate({ name: 'my-package' });
 *
 * // Strict mode (throws an error on duplication)
 * try {
 *   deduplicate({ name: 'my-critical-package', strict: true });
 * } catch (e) {
 *   console.error('Critical package duplication detected!', e);
 *   process.exit(1);
 * }
 * ```
 */
export function deduplicate(args: {name: string; strict?: true}): void {
  if (Object.hasOwn(list, args.name)) {
    const error = new Error('duplication_detected', {
      cause: {
        name: args.name,
      },
    });

    if (args.strict) {
      throw error;
    }
    else {
      console.error(error);
    }
  }

  list[args.name] = true;
}

// Register the current package to be deduplicated.
deduplicate({name: __package_name__});

/**
 * Old `definePackage` for backward compatibility.
 *
 * @param {string} packageName - The name of the package.
 * @deprecated Use `deduplicate` instead. It provides more functionality, including a strict mode.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function definePackage(packageName: string, _?: string): void {
  console.warn('`definePackage` in `@alwatr/dedupe` is deprecated. Use `deduplicate` instead.');
  deduplicate({name: packageName});
}
