import {platformInfo} from '@alwatr/platform-info';

/**
 * Defines the options for retrieving an environment variable.
 */
export type GetEnvOption = {
  /**
   * The name of the environment variable to retrieve (e.g., 'NODE_ENV').
   */
  name: string;

  /**
   * A fallback value to use if the environment variable is not set.
   * If `defaultValue` is not provided and the variable is missing, an error will be thrown,
   * unless a `developmentValue` is available in a development environment.
   */
  defaultValue?: string;

  /**
   * A specific value to use only when in a development environment (`platformInfo.development === true`).
   * This takes precedence over `defaultValue` in development mode but is ignored in production.
   */
  developmentValue?: string;
};

/**
 * Retrieves an environment variable with support for development-specific values and defaults.
 *
 * This function safely reads from `process.env`. It provides a structured way to handle
 * required variables, provide fallbacks, and use different values for development and production environments.
 * An empty string value is treated as `undefined`.
 *
 * @param {GetEnvOption} option - The options for retrieving the environment variable.
 * @returns {string} The value of the environment variable.
 * @throws {Error} If the environment variable is not set and no default/development value is available.
 *
 * @example
 * ```ts
 * // Assuming we are in a development environment (platformInfo.development === true)
 *
 * // 1. Using developmentValue
 * const apiUrl = getEnv({
 *   name: 'API_URL',
 *   defaultValue: 'https://api.production.com',
 *   developmentValue: 'http://localhost:3000/api'
 * });
 * console.log(apiUrl); // 'http://localhost:3000/api'
 *
 * // 2. Using defaultValue when developmentValue is not provided
 * const appName = getEnv({
 *   name: 'APP_NAME',
 *   defaultValue: 'MyAwesomeApp'
 * });
 * console.log(appName); // 'MyAwesomeApp'
 *
 * // 3. Required variable (will throw if not set and no defaults)
 * try {
 *   const apiKey = getEnv({ name: 'API_KEY' });
 * } catch (e) {
 *   console.error(e.message); // 'Environment variable "API_KEY" is required.'
 * }
 *
 * // In a production environment, `developmentValue` would be ignored.
 * ```
 */
export function getEnv(option: GetEnvOption): string {
  let value = process.env[option.name];

  // Treat empty string as undefined, as it often indicates a missing value in env files.
  if (value === '') {
    value = undefined;
  }

  if (platformInfo.development === true) {
    value ??= option.developmentValue ?? option.defaultValue;
  }
  else {
    value ??= option.defaultValue;
  }

  if (value === undefined) {
    throw new Error(`Environment variable "${option.name}" is required.`);
  }

  return value;
}
