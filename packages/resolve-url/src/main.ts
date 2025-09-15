/**
 * Resolves a sequence of URL parts into a single, normalized URL.
 * It intelligently handles leading, trailing, and multiple slashes,
 * ensuring a clean and valid URL path.
 *
 * @param {...string[]} parts - A sequence of URL parts to join.
 * @returns {string} The resolved URL.
 *
 * @example
 * ```ts
 * // Basic joining
 * console.log(resolveUrl('http://example.com', 'path/', '/to/resource'));
 * // -> 'http://example.com/path/to/resource'
 *
 * // Handles multiple slashes
 * console.log(resolveUrl('a//b', 'c/'));
 * // -> 'a/b/c'
 *
 * // Preserves leading slash if present in the first part
 * console.log(resolveUrl('/api', 'v1', 'users'));
 * // -> '/api/v1/users'
 *
 * // Ignores empty and nullish parts
 * console.log(resolveUrl('a', null, 'b', '', 'c'));
 * // -> 'a/b/c'
 * ```
 */
export function resolveUrl(...parts: string[]): string {
  parts = parts.filter((part: string): part is string => typeof part === 'string' && part.length > 0);

  if (parts.length === 0) {
    return '';
  }

  const leadingSlashes = /^\/+/;
  const trailingSlashes = /\/+$/;
  const multipleSlashes = /\/{2,}/g;

  // Preserve leading slash if the first part has it.
  const prefix = parts[0].indexOf('/') === 0 ? '/' : '';

  return (
    prefix +
    parts
      .map((part) => part.replace(leadingSlashes, '').replace(trailingSlashes, ''))
      .filter((part) => part) // Remove empty parts
      .join('/')
      // Replace multiple slashes with a single slash, except for the protocol part.
      .replace('://', '{{PROTOCOL_SLASH}}')
      .replace(multipleSlashes, '/')
      .replace('{{PROTOCOL_SLASH}}', '://')
  );
}
