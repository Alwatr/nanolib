import {directiveRegistry_, logger} from './lib.js';

import type {DirectiveBase} from './directiveClass.js';

/**
 * A type definition for the constructor of a class that extends `DirectiveBase`.
 *
 * @template T - The type of the directive, which must extend `DirectiveBase`.
 */
export type DirectiveConstructor<T extends DirectiveBase = DirectiveBase> = new (
  element: HTMLElement,
  selector: string,
) => T;

/**
 * A class decorator that registers a directive with a CSS selector.
 * When `bootstrap` is called, all elements matching the selector will be
 * instantiated with the decorated class.
 *
 * @param {string} selector - The CSS selector for which this directive should be activated.
 * @returns {(constructor: DirectiveConstructor) => void} A decorator function.
 *
 * @example
 * ```ts
 * import { directive, DirectiveBase } from '@alwatr/synapse';
 *
 * @directive('[data-toggle-button]')
 * class ToggleButtonDirective extends DirectiveBase {
 *   protected override update_(): void {
 *     this.element_.addEventListener('click', () => {
 *       this.element_.classList.toggle('active');
 *     });
 *   }
 * }
 * ```
 */
export function directive(selector: string) {
  logger.logMethodArgs?.('@directive', selector);

  /**
   * The actual decorator function that receives the directive's class constructor.
   * @param {DirectiveConstructor} constructor - The constructor of the directive class.
   * @private
   */
  return function (constructor: DirectiveConstructor): void {
    directiveRegistry_.push({selector, constructor});
  };
}
