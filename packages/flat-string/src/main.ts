import {packageTracer} from '@alwatr/package-tracer';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

/**
 * This function simplifies the complex C structures that are part of a combined JavaScript string.
 *
 * @param str The string to flatten.
 * @returns The flattened string.
 * @example
 * ```typescript
 * myStr = flatString(myStr);
 * ```
 */
export function flatString(str: string): string {
  // @ts-expect-error because it alters wrong compilation errors.
  str | 0;
  return str;
}
