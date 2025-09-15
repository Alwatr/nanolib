import {createLogger} from '@alwatr/logger';

const logger = /* #__PURE__ */ createLogger(__package_name__);

/**
 * A state-based renderer function that executes a render function from a record based on the current state.
 * It supports default states and state redirection for more complex rendering logic.
 *
 * @template R - The return type of the render functions.
 * @template T - A string literal type representing the possible states.
 *
 * @param {T} state - The current state to be rendered.
 * @param {Record<T | '_default', undefined | T | (() => R)>} renderRecord - A map of states to render functions.
 *   - `() => R`: A function that returns the rendered output.
 *   - `T`: A string literal redirecting to another state in the record.
 *   - `_default`: A fallback render function or redirect state if the given `state` is not found.
 * @param {*} [thisArg=null] - The `this` context to be used when calling the render function.
 * @returns {R | undefined} The result of the executed render function, or `undefined` if no valid renderer is found.
 *
 * @example
 * ```ts
 * const renderContent = (pageState: 'loading' | 'data' | 'error' | 'extra') => {
 *   return renderState(pageState, {
 *     loading: () => 'Loading...',
 *     data: () => 'Here is the data.',
 *     error: () => 'An error occurred.',
 *     // 'extra' state redirects to 'data' state
 *     extra: 'data',
 *     // A default renderer for any other unhandled state
 *     _default: () => 'Page not found.',
 *   });
 * };
 *
 * console.log(renderContent('loading')); // 'Loading...'
 * console.log(renderContent('extra'));   // 'Here is the data.'
 * console.log(renderContent('unknown')); // 'Page not found.'
 * ```
 */
export const renderState = <R, T extends string>(
  state: T,
  renderRecord: Record<T | '_default', undefined | T | (() => R)>,
  thisArg: unknown = null,
): R | undefined => {
  logger.logMethodArgs?.('renderState', {state, renderRecord});

  let render = renderRecord[state];

  // Handle state redirection (a state pointing to another state's key).
  if (typeof render === 'string') {
    render = renderRecord[render as T];
  }

  // If no renderer is found for the current state, try the default.
  if (render === undefined) {
    if (renderRecord._default === undefined) {
      logger.error('renderState', 'invalid_render_state', {state});
      return;
    }

    // Handle default state redirection.
    if (typeof renderRecord._default === 'string') {
      if (renderRecord[renderRecord._default] === undefined) {
        logger.error('renderState', 'invalid_default_render', {default: renderRecord._default});
        return;
      }
      return renderState(renderRecord._default, renderRecord, thisArg);
    }

    render = renderRecord._default;
  }

  if (typeof render !== 'function') {
    logger.error('renderState', 'invalid_render_function', {state, render});
    return;
  }

  try {
    return render.call(thisArg);
  }
  catch (err) {
    logger.error('renderState', 'render_error', {state, err});
    return;
  }
};
