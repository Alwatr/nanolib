import type {} from '@alwatr/nano-build';
import type {} from '@alwatr/type-helper';

/**
 * Defines the metadata for a storage item, including its name and version.
 */
export interface StorageMeta {
  /**
   * A unique name for the storage item, used as a key in localStorage.
   */
  name: string;

  /**
   * The version of the data structure. This should start at 1 and be incremented
   * for each breaking change to the data structure, to handle migrations.
   */
  version: number;
}

/**
 * Defines the configuration for a `LocalStorageProvider`.
 *
 * @template T - The type of the data to be stored.
 */
export interface LocalStorageProviderConfig<T> extends StorageMeta {
  /**
   * The default value to be returned if no value is found in localStorage
   * or if the stored data is invalid.
   */
  defaultValue: T;
}
