import {handleCacheStrategy_, logger_, processOptions_, cacheSupported} from './core';

import type {FetchOptions, ResponseError, ResponseSuccess} from './type';
import type {Json, JsonObject} from '@alwatr/type-helper';

export {cacheSupported};
export type * from './type';

/**
 * It's a wrapper around the browser's `fetch` function that adds retry pattern, timeout, cacheStrategy,
 * remove duplicates, etc.
 *
 * @see {@link FetchOptions}
 * @see {@link ResponseSuccess}
 * @see {@link ResponseError}
 *
 * @param options Fetch options.
 *
 * @returns A success or error response.
 *
 * @example
 * ```typescript
 * const responseJson = await fetchJson({
 *   url: '/api/products',
 *   queryParameters: {limit: 10},
 *   timeout: 8_000,
 *   retry: 3,
 *   cacheStrategy: 'stale_while_revalidate',
 *   cacheDuplicate: 'auto',
 * });
 * ```
 */
export async function fetchJson<T extends JsonObject>(options: FetchOptions): Promise<ResponseSuccess<T> | ResponseError> {
  let response;
  let responseText;
  let responseJson;
  try {
    response = await fetch(options);
    responseText = await response.text();
    responseJson = JSON.parse(responseText) as ResponseSuccess<T>;
    responseJson.ok = true;
    responseJson.statusCode = response.status;
    return responseJson;
  }
  catch (error) {
    const responseError: ResponseError = {
      ok: false,
      statusCode: response?.status,
      statusText: response?.statusText,
      errorCode: (responseJson?.errorCode as string) ?? (error as Error).message,
      responseText,
      meta: responseJson?.meta as JsonObject,
    };

    logger_.accident('fetchJson', 'fetch_failed', {responseError, error});
    return responseError;
  }
}

/**
 * It's a wrapper around the browser's `fetch` function that adds retry pattern, timeout, cacheStrategy,
 * remove duplicates, etc.
 *
 * @see {@link FetchOptions}
 *
 * @param options Fetch options.
 *
 * @returns A promise that resolves to the Response to that request, whether it is successful or not.
 *
 * @example
 * ```typescript
 * const response = await fetch({
 *   url: '/api/products',
 *   queryParameters: {limit: 10},
 *   timeout: 8_000,
 *   retry: 3,
 *   cacheStrategy: 'stale_while_revalidate',
 *   cacheDuplicate: 'auto',
 * });
 * ```
 */
export function fetch(options: FetchOptions): Promise<Response> {
  options = processOptions_(options);
  logger_.logMethodArgs?.('fetch', {options});
  return handleCacheStrategy_(options as Required<FetchOptions>);
}
