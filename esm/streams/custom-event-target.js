export class CustomEventTarget extends EventTarget {
  /**
   * Alias for EventTarget.addEventListener()
   *
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} callback
   * @param {AddEventListenerOptions | boolean} [options]
   * @return {this}
   */
  on (type, callback, options) {
    this.addEventListener(type, callback, options);
    return this;
  }

  /**
   * Construct and dispatch an event
   *
   * @param {string} type
   * @param {object} data
   * @returns {boolean}
   */
  emit (type, data) {
    /** @type {Event} */
    const event = new Event(type);
    Object.entries(data).forEach(([prop, value]) => {
      const p = (prop);
      // @ts-ignore
      event[p] = value;
    });

    return this.dispatchEvent(event);
  }
}
