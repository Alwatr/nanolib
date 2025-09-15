import {LocalStorageProvider} from './local-storage.provider.js';

import type {LocalStorageProviderConfig} from './type.js';

export * from './local-storage.provider.js';
export type * from './type.js';

/**
 * A factory function to create a new `LocalStorageProvider` instance.
 *
 * This function simplifies the creation of a local storage provider.
 *
 * @template T - The type of the data to be stored. Must be a `JsonValue`.
 * @param {LocalStorageProviderConfig<T>} config - The configuration for the provider.
 * @returns {LocalStorageProvider<T>} An instance of `LocalStorageProvider`.
 *
 * @example
 * ```ts
 * const userSettingsProvider = createLocalStorageProvider({
 *   name: 'user-settings',
 *   version: 1,
 *   defaultValue: { theme: 'light', notifications: true }
 * });
 *
 * // Write new settings
 * userSettingsProvider.write({ theme: 'dark', notifications: false });
 *
 * // Read the current settings
 * const currentSettings = userSettingsProvider.read();
 * console.log(currentSettings); // { theme: 'dark', notifications: false }
 * ```
 */
export function createLocalStorageProvider<T extends JsonValue>(
  config: LocalStorageProviderConfig<T>,
): LocalStorageProvider<T> {
  return new LocalStorageProvider<T>(config);
}
