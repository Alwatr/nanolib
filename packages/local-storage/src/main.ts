/* eslint-disable @typescript-eslint/no-explicit-any */

import {parseJson} from '@alwatr/node-fs';

import type {Dictionary} from '@alwatr/type-helper';

/**
 * Generate local storage key.
 *
 * @param name name of the item
 * @param version version of the item
 *
 * @example
 * ```typescript
 * generateLocalStorageKey_('my-item', 1); // my-item.v1
 * ```
 */
export function generateLocalStorageKey_(name: string, version: number): string {
  return `${name}.v${version}`;
}

/**
 * Get local storage item and parse it as JSON.
 * If item is not found, return default value.
 *
 * @param name name of the item
 * @param version version of the item
 * @param defaultValue default value of the item
 *
 * @example
 * ```typescript
 * const value = getLocalStorageItem('my-item', 1, {a: 1, b: 2});
 * ```
 */
export function getLocalStorageItem<T extends Dictionary<any>>(name: string, version: number, defaultValue: T): T {
  const localStorageKey = generateLocalStorageKey_(name, version);
  const value = localStorage.getItem(localStorageKey);
  if (value === 'null' || value === 'undefined') return defaultValue;
  return value == null ? defaultValue : parseJson(value) ?? defaultValue;
}

/**
 * Set local storage item as JSON.
 * If value is null, remove the item.
 *
 * @param name name of the item
 * @param version version of the item
 * @param value value of the item
 *
 * @example
 * ```typescript
 * setLocalStorageItem('my-item', 1, {a: 1, b: 2});
 * ```
 */
export function setLocalStorageItem<T extends Dictionary<any>>(name: string, version: number, value: T): void {
  const localStorageKey = generateLocalStorageKey_(name, version);
  if (value == null) {
    localStorage.removeItem(localStorageKey);
  }
  localStorage.setItem(localStorageKey, JSON.stringify(value));
}

/**
 * Clear all items from local storage.
 *
 * @example
 * ```typescript
 * clearLocalStorage();
 * ```
 */
export function clearLocalStorage(): void {
  localStorage.clear();
}
