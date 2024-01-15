import {globalScope} from '@alwatr/global-scope';
import {definePackage} from '@alwatr/logger';
import {waitForTimeout} from '@alwatr/wait';

import type {FetchOptions} from './type';
import type {} from '@alwatr/nano-build';

export type * from './type';

const logger = definePackage('@alwatr/fetch', __package_version__);

let CacheStorage: Cache;
const cacheSupported = 'caches' in globalScope;

const duplicateRequestStorage: Record<string, Promise<Response>> = {};

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
 *   timeout: 10_000,
 *   retry: 3,
 *   cacheStrategy: 'stale_while_revalidate',
 *   cacheDuplicate: 'auto',
 * });
 * ```
 */
export function fetch(options: FetchOptions): Promise<Response> {
  options = _processOptions(options);
  logger.logMethodArgs?.('fetch', {options});
  return _handleCacheStrategy(options as Required<FetchOptions>);
}

/**
 * Process fetch options and set defaults, etc.
 *
 * @param options Fetch options.
 *
 * @returns Required fetch options.
 */
function _processOptions(options: FetchOptions): Required<FetchOptions> {
  options.method ??= 'GET';
  options.window ??= null;

  options.timeout ??= 10_000;
  options.retry ??= 3;
  options.retryDelay ??= 1_000;
  options.cacheStrategy ??= 'network_only';
  options.removeDuplicate ??= 'never';
  options.headers ??= {};

  if (options.cacheStrategy !== 'network_only' && cacheSupported !== true) {
    logger.incident?.('fetch', 'fetch_cache_strategy_unsupported', {
      cacheSupported,
    });
    options.cacheStrategy = 'network_only';
  }

  if (options.removeDuplicate === 'auto') {
    options.removeDuplicate = cacheSupported ? 'until_load' : 'always';
  }

  if (options.url.lastIndexOf('?') === -1 && options.queryParameters != null) {
    const queryParameters = options.queryParameters;
    // prettier-ignore
    const queryArray = Object
      .keys(queryParameters)
      .map((key) => `${key}=${String(queryParameters[key])}`);

    if (queryArray.length > 0) {
      options.url += '?' + queryArray.join('&');
    }
  }

  if (options.bodyJson != null) {
    options.body = JSON.stringify(options.bodyJson);
    options.headers['Content-Type'] = 'application/json';
  }

  if (options.token != null) {
    options.headers.Authorization = `Bearer ${options.token}`;
  }

  return options as Required<FetchOptions>;
}

/**
 * Handle Cache Strategy over `_handleRemoveDuplicate`.
 */
async function _handleCacheStrategy(options: Required<FetchOptions>): Promise<Response> {
  if (options.cacheStrategy === 'network_only') {
    return _handleRemoveDuplicate(options);
  }
  // else handle cache strategies!
  logger.logMethod?.('_handleCacheStrategy');

  if (CacheStorage == null && options.cacheStorageName == null) {
    CacheStorage = await caches.open('fetch_cache');
  }

  const cacheStorage = options.cacheStorageName != null ? await caches.open(options.cacheStorageName) : CacheStorage;

  const request = new Request(options.url, options);

  switch (options.cacheStrategy) {
    case 'cache_first': {
      const cachedResponse = await cacheStorage.match(request);
      if (cachedResponse != null) {
        return cachedResponse;
      }
      // else
      const response = await _handleRemoveDuplicate(options);
      if (response.ok) {
        cacheStorage.put(request, response.clone());
      }
      return response;
    }

    case 'cache_only': {
      const cachedResponse = await cacheStorage.match(request);
      if (cachedResponse == null) {
        logger.accident('_handleCacheStrategy', 'fetch_cache_not_found', {url: request.url});
        throw new Error('fetch_cache_not_found');
      }
      // else
      return cachedResponse;
    }

    case 'network_first': {
      try {
        const networkResponse = await _handleRemoveDuplicate(options);
        if (networkResponse.ok) {
          cacheStorage.put(request, networkResponse.clone());
        }
        return networkResponse;
      }
      catch (err) {
        const cachedResponse = await cacheStorage.match(request);
        if (cachedResponse != null) {
          return cachedResponse;
        }
        // else
        throw err;
      }
    }

    case 'update_cache': {
      const networkResponse = await _handleRemoveDuplicate(options);
      if (networkResponse.ok) {
        cacheStorage.put(request, networkResponse.clone());
      }
      return networkResponse;
    }

    case 'stale_while_revalidate': {
      const cachedResponse = await cacheStorage.match(request);
      const fetchedResponsePromise = _handleRemoveDuplicate(options).then((networkResponse) => {
        if (networkResponse.ok) {
          cacheStorage.put(request, networkResponse.clone());
          if (typeof options.revalidateCallback === 'function') {
            setTimeout(options.revalidateCallback, 0, networkResponse.clone());
          }
        }
        return networkResponse;
      });

      return cachedResponse ?? fetchedResponsePromise;
    }

    default: {
      return _handleRemoveDuplicate(options);
    }
  }
}

/**
 * Handle Remove Duplicates over `_handleRetryPattern`.
 */
async function _handleRemoveDuplicate(options: Required<FetchOptions>): Promise<Response> {
  if (options.removeDuplicate === 'never') return _handleRetryPattern(options);

  logger.logMethod?.('_handleRemoveDuplicate');

  const cacheKey = options.method + ' ' + options.url;

  // We must cache fetch promise without await for handle other parallel requests.
  duplicateRequestStorage[cacheKey] ??= _handleRetryPattern(options);

  try {
    // For all requests need to await for clone responses.
    const response = await duplicateRequestStorage[cacheKey];

    if (duplicateRequestStorage[cacheKey] != null) {
      if (response.ok !== true || options.removeDuplicate === 'until_load') {
        delete duplicateRequestStorage[cacheKey];
      }
    }

    return response.clone();
  }
  catch (err) {
    // clean cache on any error.
    delete duplicateRequestStorage[cacheKey];
    throw err;
  }
}

/**
 * Handle retry pattern over `_handleTimeout`.
 */
async function _handleRetryPattern(options: Required<FetchOptions>): Promise<Response> {
  if (!(options.retry > 1)) return _handleTimeout(options);

  logger.logMethod?.('_handleRetryPattern');
  options.retry--;

  const externalAbortSignal = options.signal;

  try {
    const response = await _handleTimeout(options);

    if (response.status < 500) {
      return response;
    }
    // else
    throw new Error('fetch_server_error');
  }
  catch (err) {
    logger.accident('fetch', 'fetch_failed_retry', err);

    if (globalScope.navigator?.onLine === false) {
      throw new Error('offline');
    }

    await waitForTimeout(options.retryDelay);

    options.signal = externalAbortSignal;
    return _handleRetryPattern(options);
  }
}

/**
 * It's a wrapper around the browser's `fetch` with timeout.
 */
function _handleTimeout(options: FetchOptions): Promise<Response> {
  if (options.timeout === 0) {
    return globalScope.fetch(options.url, options);
  }
  // else
  logger.logMethod?.('_handleTimeout');
  return new Promise((resolved, reject) => {
    const abortController = typeof globalScope.AbortController === 'function' ? new AbortController() : null;
    const externalAbortSignal = options.signal;
    options.signal = abortController?.signal;

    if (abortController !== null && externalAbortSignal != null) {
      // Respect external abort signal
      externalAbortSignal.addEventListener('abort', () => abortController.abort(), {once: true});
    }

    const timeoutId = setTimeout(() => {
      reject(new Error('fetch_timeout'));
      abortController?.abort('fetch_timeout');
    }, options.timeout);

    // abortController.signal.addEventListener('abort', () => {
    //   logger.incident('fetch', 'fetch_abort_signal', {
    //     reason: abortController.signal.reason,
    //   });
    // });

    globalScope
      .fetch(options.url, options)
      .then((response) => resolved(response))
      .catch((reason) => reject(reason))
      .finally(() => {
        delete options.signal; // try to avoid memory leak in nodejs!
        clearTimeout(timeoutId);
      });
  });
}
