import {directiveRegistry_, logger} from './lib.js';

/**
 * An attribute used to mark elements that have already been initialized by a directive.
 * This prevents re-instantiation on subsequent bootstrap calls.
 * @private
 */
const initializedAttribute = '_synapseConnected';

/**
 * Initializes all registered directives within a specified root element.
 * It queries the DOM for elements matching the selectors in the `directiveRegistry_`
 * and instantiates their corresponding directive classes.
 *
 * This function is idempotent; it marks initialized elements with an attribute
 * to prevent them from being processed again.
 *
 * @param {Element | Document} [rootElement=document.body] - The container element to scan for directives.
 *
 * @example
 * ```ts
 * // Define a directive
 * @directive('.my-button')
 * class MyButtonDirective extends DirectiveBase {
 *   // ...
 * }
 *
 * // Bootstrap all directives on the page after the DOM is loaded.
 * document.addEventListener('DOMContentLoaded', () => bootstrapDirectives());
 *
 * // Or, bootstrap directives on a dynamically added part of the page.
 * const newContent = document.createElement('div');
 * newContent.innerHTML = '<button class="my-button">Click Me</button>';
 * document.body.appendChild(newContent);
 * bootstrapDirectives(newContent);
 * ```
 */
export function bootstrapDirectives(rootElement: Element | Document = document.body): void {
  logger.logMethod?.('bootstrapDirectives');

  for (const {selector, constructor} of directiveRegistry_) {
    try {
      const uninitializedSelector = `${selector}:not([${initializedAttribute}])`;
      const elements = rootElement.querySelectorAll<HTMLElement>(uninitializedSelector);
      if (elements.length === 0) continue;

      logger.logOther?.(`Found ${elements.length} new element(s) for directive "${selector}"`);
      elements.forEach((element) => {
        // Mark the element as processed before creating an instance.
        element.setAttribute(initializedAttribute, 'true');
        // Instantiate the directive, which will then control the element.
        new constructor(element, selector);
      });
    }
    catch (err) {
      logger.error('bootstrapDirectives', 'directive_instantiation_error', err, {selector});
    }
  }
}
