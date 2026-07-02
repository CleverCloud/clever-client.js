export class CustomEventTarget extends EventTarget {
  /**
   * Alias for EventTarget.addEventListener()
   */
  on(type: string, callback: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this {
    this.addEventListener(type, callback, options);
    return this;
  }

  /**
   * Construct and dispatch an event
   */
  emit(type: string, data: object): boolean {
    const event: Event = new Event(type);
    Object.entries(data).forEach(([prop, value]) => {
      const p = prop;
      // @ts-expect-error dynamic event property assignment is not expressible on the DOM Event type
      event[p] = value;
    });

    return this.dispatchEvent(event);
  }
}
