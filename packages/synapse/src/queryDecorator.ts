/* eslint-disable @typescript-eslint/no-explicit-any */
import type {DirectiveBase} from './directiveClass.js';

/**
 * A property decorator that provides a convenient way to query a single element
 * within a directive's host element. The result is cached by default for performance.
 *
 * @param {string} selector - The CSS selector to query for.
 * @param {boolean} [cache=true] - Whether to cache the query result.
 * @returns {PropertyDecorator} A property decorator.
 *
 * @example
 * ```ts
 * @directive('[my-card]')
 * class MyCardDirective extends DirectiveBase {
 *   @query('.card-header')
 *   protected headerElement?: HTMLDivElement;
 *
 *   protected override update_() {
 *     if (this.headerElement) {
 *       this.headerElement.textContent = 'New Header';
 *     }
 *   }
 * }
 * ```
 */
export function query(selector: string, cache = true): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const privateKey = Symbol(`${String(propertyKey)}__`);

    Object.defineProperty(target, propertyKey, {
      get(this: DirectiveBase) {
        if (cache === false || (this as any)[privateKey] === undefined) {
          (this as any)[privateKey] = this.element_.querySelector(selector);
        }
        return (this as any)[privateKey];
      },
      configurable: true,
      enumerable: true,
    });
  };
}

/**
 * A property decorator that provides a convenient way to query all elements
 * matching a selector within a directive's host element. The result is cached by default.
 *
 * @param {string} selector - The CSS selector to query for.
 * @param {boolean} [cache=true] - Whether to cache the query result.
 * @returns {PropertyDecorator} A property decorator.
 *
 * @example
 * ```ts
 * @directive('[my-list]')
 * class MyListDirective extends DirectiveBase {
 *   @queryAll('.list-item')
 *   protected itemElements?: NodeListOf<HTMLLIElement>;
 *
 *   protected override update_() {
 *     this.itemElements?.forEach((item, index) => {
 *       item.textContent = `Item ${index + 1}`;
 *     });
 *   }
 * }
 * ```
 */
export function queryAll(selector: string, cache = true): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const privateKey = Symbol(`${String(propertyKey)}__`);

    Object.defineProperty(target, propertyKey, {
      get(this: DirectiveBase) {
        if (cache === false || (this as any)[privateKey] === undefined) {
          (this as any)[privateKey] = this.element_.querySelectorAll(selector);
        }
        return (this as any)[privateKey];
      },
      configurable: true,
      enumerable: true,
    });
  };
}
