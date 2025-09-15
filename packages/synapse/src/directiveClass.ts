import {delay} from '@alwatr/delay';
import {createLogger} from '@alwatr/logger';

/**
 * An abstract base class for creating directives.
 * Directives are used to attach custom behavior to DOM elements.
 */
export abstract class DirectiveBase {
  /**
   * The CSS selector that identifies this directive.
   * @protected
   */
  protected readonly selector_: string;

  /**
   * A logger instance specific to this directive, tagged with its selector.
   * @protected
   */
  protected readonly logger_: ReturnType<typeof createLogger>;

  /**
   * The DOM element to which this directive is attached.
   * @protected
   */
  protected readonly element_: HTMLElement;

  /**
   * Initializes the directive, linking it to a DOM element.
   *
   * @param {HTMLElement} element - The DOM element this directive will control.
   * @param {string} selector - The CSS selector used to identify this directive.
   */
  public constructor(element: HTMLElement, selector: string) {
    this.selector_ = selector;
    this.logger_ = createLogger(`directive:${selector}`);
    this.logger_.logMethodArgs?.('new', {selector, element});
    this.element_ = element;

    (async () => {
      await delay.nextMicrotask();
      await this.init_();
      await this.update_();
    })();
  }

  /**
   * A lifecycle method called to update the directive's state or behavior.
   * This method must be implemented by subclasses.
   * @protected
   */
  protected abstract update_(): Awaitable<void>;

  /**
   * An initialization lifecycle method that runs once, after the directive is constructed.
   * @protected
   */
  protected init_(): Awaitable<void> {
    this.logger_.logMethod?.('init');
  }

  /**
   * A cleanup lifecycle method. It removes the element from the DOM and nullifies the reference.
   * @protected
   */
  protected destroy_(): Awaitable<void> {
    this.logger_.logMethod?.('destroy');
    this.element_.remove();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).element_ = null;
  }

  /**
   * Dispatches a custom event from the directive's host element.
   *
   * @param {string} eventName - The name of the custom event.
   * @param {*} [detail] - Optional data to include in the event's `detail` property.
   * @protected
   */
  protected dispatch_(eventName: string, detail?: unknown): void {
    this.logger_.logMethodArgs?.('dispatch_', {eventName, detail});
    this.element_.dispatchEvent(new CustomEvent(eventName, {detail, bubbles: true}));
  }
}
