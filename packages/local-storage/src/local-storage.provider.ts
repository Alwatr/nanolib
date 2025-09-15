import {createLogger} from '@alwatr/logger';

import type {LocalStorageProviderConfig, StorageMeta} from './type.js';

/**
 * A provider class for managing a specific, versioned item in `localStorage`.
 * It handles key generation, serialization (JSON), and a simple migration strategy.
 *
 * @template T - The type of the data to be stored. Must be a `JsonValue`.
 *
 * @example
 * ```ts
 * const userSettingsProvider = new LocalStorageProvider({
 *   name: 'user-settings',
 *   version: 2,
 *   defaultValue: { theme: 'light', notifications: true }
 * });
 *
 * // Write new settings
 * userSettingsProvider.write({ theme: 'dark', notifications: false });
 *
 * // Read the current settings
 * const currentSettings = userSettingsProvider.read();
 * console.log(currentSettings); // { theme: 'dark', notifications: false }
 *
 * // This will remove 'user-settings.v1' from localStorage on initialization.
 * ```
 */
export class LocalStorageProvider<T extends JsonValue> {
  /**
   * The version of the `@alwatr/local-storage` package itself.
   */
  public static readonly version = __package_version__;

  /**
   * The unique, versioned key used for this provider instance in `localStorage`.
   * @private
   */
  private readonly key__: string;

  /**
   * The logger instance for this provider.
   * @protected
   */
  protected readonly logger_ = createLogger(`local-storage-provider: ${this.config_.name}, v: ${this.config_.version}`);

  /**
   * Constructs a new `LocalStorageProvider`.
   *
   * @param {LocalStorageProviderConfig<T>} config_ - The configuration for this provider instance.
   */
  public constructor(protected readonly config_: LocalStorageProviderConfig<T>) {
    this.logger_.logMethodArgs?.('constructor', {config: this.config_});
    this.key__ = LocalStorageProvider.getKey(this.config_);
    this.migrate__();
  }

  /**
   * Generates a versioned storage key from storage metadata.
   *
   * @param {StorageMeta} meta - An object containing the name and version.
   * @returns {string} The versioned key string (e.g., 'my-item.v1').
   */
  public static getKey(meta: StorageMeta): string {
    return `${meta.name}.v${meta.version}`;
  }

  /**
   * Statically checks if a versioned item exists in `localStorage`.
   * This is a high-performance method that avoids creating a full provider instance.
   *
   * @param {StorageMeta} meta - The metadata of the item to check.
   * @returns {boolean} `true` if the item exists, otherwise `false`.
   *
   * @example
   * ```ts
   * const hasOldData = LocalStorageProvider.has({ name: 'user-data', version: 1 });
   * if (hasOldData) {
   *   // Logic to handle migration or notify the user
   * }
   * ```
   */
  public static has(meta: StorageMeta): boolean {
    const key = LocalStorageProvider.getKey(meta);
    return localStorage.getItem(key) !== null;
  }

  /**
   * Writes the default value to `localStorage` and returns it.
   * @private
   */
  private writeDefault__(): T {
    this.logger_.logMethodArgs?.('writeDefaultــ', this.config_.defaultValue);
    this.write(this.config_.defaultValue);
    return this.config_.defaultValue;
  }

  /**
   * Reads and parses the value from `localStorage`.
   * If the item doesn't exist or is invalid JSON, it writes and returns the default value.
   *
   * @returns {T} The stored value or the default value.
   */
  public read(): T {
    try {
      const value = localStorage.getItem(this.key__);

      if (value === null) {
        this.logger_.logMethod?.('read//no_value');
        return this.writeDefault__();
      }

      const parsedValue = JSON.parse(value) as T;
      this.logger_.logMethodFull?.('read//value', undefined, {parsedValue});
      return parsedValue;
    }
    catch (err) {
      this.logger_.error('read', 'read_parse_error', {err});
      return this.writeDefault__();
    }
  }

  /**
   * Serializes and writes a value to `localStorage`.
   *
   * @param {T} value - The value to write. It must be a `JsonValue`.
   */
  public write(value: T): void {
    this.logger_.logMethodArgs?.('write', {value});
    try {
      localStorage.setItem(this.key__, JSON.stringify(value));
    }
    catch (err) {
      this.logger_.error('write', 'write_stringify_error', {err});
    }
  }

  /**
   * Removes the item from `localStorage`.
   */
  public remove(): void {
    localStorage.removeItem(this.key__);
  }

  /**
   * Manages data migration by removing all stored versions of the item
   * that are older than the current version specified in the config.
   * @private
   */
  private migrate__(): void {
    if (this.config_.version <= 1) return;

    // Iterate from v1 up to the version just before the current one and remove them.
    for (let i = 1; i < this.config_.version; i++) {
      const oldKey = LocalStorageProvider.getKey({name: this.config_.name, version: i});
      localStorage.removeItem(oldKey);
    }
  }
}
