import type {HttpMethod, HttpRequestHeaders} from '@alwatr/http-primer';
import type {Duration} from '@alwatr/parse-duration';

/**
 * Represents a dictionary of query parameters for a URL.
 * Keys are strings, and values can be of type `string`, `number`, or `boolean`.
 */
export type QueryParams = DictionaryOpt<string | number | boolean>;

/**
 * Defines the caching strategy for a fetch request. This controls how responses are stored and retrieved from the cache.
 *
 * - `network_only`: Always fetch from the network, ignoring any cache.
 * - `network_first`: Try to fetch from the network first. If the network request fails, fall back to the cache.
 * - `cache_only`: Only fetch from the cache. If the resource is not in the cache, the request will fail.
 * - `cache_first`: Try to fetch from the cache first. If the resource is not in the cache, fall back to the network.
 * - `update_cache`: Always fetch from the network, and update the cache with the new response.
 * - `stale_while_revalidate`: Serve from cache and revalidate in the background.
 */
export type CacheStrategy =
  | 'network_only'
  | 'network_first'
  | 'cache_only'
  | 'cache_first'
  | 'update_cache'
  | 'stale_while_revalidate';

/**
 * Defines how to handle identical, parallel (in-flight) requests.
 *
 * - `never`: No deduplication is performed; all requests are sent.
 * - `always`: If an identical request is in-flight, subsequent requests will use its response.
 * - `until_load`: Similar to `always`, but the response is only cached until the initial request is complete.
 * - `auto`: Automatically selects the best strategy (`until_load` in browsers, `always` otherwise).
 */
export type CacheDuplicate = 'never' | 'always' | 'until_load' | 'auto';

/**
 * Defines the extended options for an Alwatr fetch request, providing more control over caching, retries, and other features.
 */
export interface AlwatrFetchOptions_ {
  /**
   * The HTTP request method.
   * @default 'GET'
   */
  method: HttpMethod;

  /**
   * An object representing the request headers.
   */
  headers: HttpRequestHeaders & DictionaryReq<string>;

  /**
   * The request timeout duration. Can be a number in milliseconds or a string like '5s'.
   * A value of `0` disables the timeout.
   * @default '8s'
   */
  timeout: Duration;

  /**
   * The number of times to retry a failed request.
   * Retries are attempted on network errors, timeouts, or 5xx server responses.
   * @default 3
   */
  retry: number;

  /**
   * The delay between retry attempts. Can be a number in milliseconds or a string like '2s'.
   * @default '1s'
   */
  retryDelay: Duration;

  /**
   * The strategy for handling duplicate parallel requests.
   * Uniqueness is determined by the method, URL, and request body.
   * @default 'never'
   */
  removeDuplicate: CacheDuplicate;

  /**
   * The caching strategy to apply to the request.
   * This requires a browser environment that supports the Cache API.
   * @default 'network_only'
   */
  cacheStrategy: CacheStrategy;

  /**
   * A callback function that is executed with the fresh response when using the 'stale_while_revalidate' cache strategy.
   * This allows you to process the updated data in the background.
   */
  revalidateCallback?: (response: Response) => void | Promise<void>;

  /**
   * A custom name for the `CacheStorage` instance to use for this request.
   * @default 'fetch_cache'
   */
  cacheStorageName: string;

  /**
   * A JavaScript object to be sent as the request's JSON body.
   * This will automatically set the 'Content-Type' header to 'application/json'.
   */
  bodyJson?: JsonValue;

  /**
   * A JavaScript object of query parameters to be appended to the request URL.
   */
  queryParams?: QueryParams;

  /**
   * A bearer token to be added to the 'Authorization' header.
   * This is a convenient shorthand for setting the authorization header.
   */
  bearerToken?: string;

  /**
   * Alwatr-specific authentication credentials.
   * If provided, this will set the `user-id` and `user-token` headers.
   */
  alwatrAuth?: {
    userId: string;
    userToken: string;
  };
}

/**
 * A combined type for fetch options, including both standard `RequestInit` properties and the extended `AlwatrFetchOptions_`.
 * The `headers` property from `RequestInit` is omitted to avoid conflicts with the more specific `AlwatrFetchOptions_` headers.
 */
export type FetchOptions = Partial<AlwatrFetchOptions_> & Omit<RequestInit, 'headers'>;
