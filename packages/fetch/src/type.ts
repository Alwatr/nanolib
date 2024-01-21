import type {Dictionary, Json, JsonObject} from '@alwatr/type-helper';

/**
 * Represents the available HTTP methods.
 */
export type Methods = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'TRACE' | 'OPTIONS' | 'PATCH';

/**
 * Represents a dictionary of query parameters.
 * The keys are strings and the values can be strings, numbers, or booleans.
 */
export type QueryParameters = Dictionary<string | number | boolean>;

/**
 * Represents the cache strategy for fetching data.
 *
 * - 'network_only': Fetches data from the network only.
 * - 'network_first': Tries to fetch data from the network first, and falls back to the cache if the network request fails.
 * - 'cache_only': Fetches data from the cache only.
 * - 'cache_first': Tries to fetch data from the cache first, and falls back to the network if the cache request fails.
 * - 'update_cache': Fetches data from the network and updates the cache with the new data.
 * - 'stale_while_revalidate': Returns the stale data from the cache while fetching updated data from the network.
 */
export type CacheStrategy = 'network_only' | 'network_first' | 'cache_only' | 'cache_first' | 'update_cache' | 'stale_while_revalidate';

/**
 * Represents the caching behavior for duplicate requests.
 * - 'never': The response will not be cached.
 * - 'always': The response will always be cached.
 * - 'until_load': The response will be cached until the page is reloaded.
 * - 'auto': The caching behavior will be determined automatically.
 */
export type CacheDuplicate = 'never' | 'always' | 'until_load' | 'auto';

/**
 * Options for the fetch request.
 */
export interface FetchOptions extends RequestInit {
  /**
   * Request URL.
   */
  url: string;

  /**
   * A string to set the request's method.
   *
   * @default 'GET'
   */
  method?: Methods;

  /**
   * A Headers object to set the request's headers.
   */
  headers?: Dictionary<string>;

  /**
   * A timeout for the fetch request.
   * Set `0` to disable it.
   *
   * Use with caution, as it may cause memory leaks in Node.js.
   *
   * @default 8_000 ms
   */
  timeout?: number;

  /**
   * If the fetch response is not acceptable or timed out, it will retry the request.
   *
   * @default 3
   */
  retry?: number;

  /**
   * Delay before each retry.
   *
   * @default 1_000 ms
   */
  retryDelay?: number;

  /**
   * Simple memory caching to remove duplicate/parallel requests.
   *
   * - `never`: Never use memory caching.
   * - `always`: Always use memory caching and remove all duplicate requests.
   * - `until_load`: Cache parallel requests until the request is completed (it will be removed after the promise is resolved).
   * - `auto`: If CacheStorage is supported, use `until_load` strategy; otherwise, use `always`.
   *
   * @default 'never'
   */
  removeDuplicate?: CacheDuplicate;

  /**
   * Strategies for caching.
   *
   * - `network_only`: Only network request without any cache.
   * - `network_first`: Network first, falling back to cache.
   * - `cache_only`: Cache only without any network request.
   * - `cache_first`: Cache first, falling back to network.
   * - `update_cache`: Like `network_only` but with update cache.
   * - `stale_while_revalidate`: Fastest strategy, use cached first but always request network to update the cache.
   *
   * @default 'network_only'
   */
  cacheStrategy?: CacheStrategy;

  /**
   * Revalidate callback for `stale_while_revalidate` cache strategy.
   */
  revalidateCallback?: (response: Response) => void | Promise<void>;

  /**
   * Custom name for the cache storage.
   */
  cacheStorageName?: string;

  /**
   * Body as a JavaScript object.
   */
  bodyJson?: Json;

  /**
   * URL query parameters as a JavaScript object.
   */
  queryParameters?: QueryParameters;

  /**
   * Add token to the Authentication bearer header.
   */
  bearerToken?: string;

  /**
   * Alwatr token scheme
   */
  alwatrAuth?: {
    userId: string;
    userToken: string;
  };
}

export type ResponseSuccess<T extends JsonObject> = T & {
  ok: true;
  statusCode: number;
};

export type ResponseError = {
  ok: false;
  statusCode?: number;
  statusText?: string;
  errorCode: string;
  responseText?: string;
  meta?: JsonObject;
}
