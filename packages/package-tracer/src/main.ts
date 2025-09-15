/**
 * A utility for tracking loaded packages and their versions at runtime.
 *
 * This is useful for debugging and ensuring that the correct versions of packages are loaded,
 * especially in a monorepo or a complex dependency graph.
 *
 * Note: This utility does **not** prevent duplicate versions from being loaded.
 * For deduplication, use the `@alwatr/dedupe` package.
 *
 * @example
 * ```ts
 * import { packageTracer } from '@alwatr/package-tracer';
 *
 * // Register a package
 * packageTracer.add('my-package', '1.2.3');
 *
 * // Check for a package
 * if (packageTracer.has('my-package')) {
 *   const versions = packageTracer.get('my-package');
 *   console.log('my-package versions:', versions); // ['1.2.3']
 * }
 * ```
 */
export const packageTracer = {
  /**
   * A dictionary mapping package names to a readonly array of their loaded versions.
   */
  list: {} as Readonly<DictionaryOpt<readonly string[]>>,

  /**
   * Adds a package name and its version to the tracker.
   *
   * @param {string} packageName - The name of the package (e.g., '@alwatr/logger').
   * @param {string} version - The version of the package (e.g., '1.2.3').
   *
   * @example
   * ```ts
   * packageTracer.add('my-package', '1.0.0');
   * packageTracer.add('my-package', '1.0.1'); // Tracks multiple versions
   * ```
   */
  add(packageName: string, version: string): void {
    (this.list[packageName] as string[]) ??= [];
    (this.list[packageName] as string[]).push(version);
  },

  /**
   * Checks if a package has been tracked.
   *
   * @param {string} packageName - The name of the package to check.
   * @returns {boolean} `true` if the package has at least one version tracked, otherwise `false`.
   *
   * @example
   * ```ts
   * if (packageTracer.has('my-package')) {
   *   console.log('my-package is loaded.');
   * }
   * ```
   */
  has(packageName: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.list, packageName);
  },

  /**
   * Retrieves all tracked versions for a given package.
   *
   * @param {string} packageName - The name of the package.
   * @returns {readonly string[] | undefined} A readonly array of version strings, or `undefined` if the package is not tracked.
   *
   * @example
   * ```ts
   * const versions = packageTracer.get('my-package');
   * if (versions) {
   *   console.log(`Loaded versions of my-package: ${versions.join(', ')}`);
   * }
   * ```
   */
  get(packageName: string): readonly string[] | undefined {
    return this.list[packageName];
  },
} as const;

// Automatically track this package itself in development mode.
__dev_mode__: packageTracer.add(__package_name__, __package_version__);
