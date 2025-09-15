import {createLogger} from '@alwatr/logger';

import type {DirectiveConstructor} from './directiveDecorator.js';
import type {} from '@alwatr/type-helper';

/**
 * The logger instance for the `@alwatr/synapse` package.
 * @private
 */
export const logger = /* #__PURE__ */ createLogger('alwatr/synapse');

/**
 * A private registry that holds all registered directive constructors along with their selectors.
 * This is used by the `bootstrap` function to instantiate and connect directives to elements.
 * @private
 */
export const directiveRegistry_: {selector: string; constructor: DirectiveConstructor}[] = [];
