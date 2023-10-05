export class CustomEventTarget extends EventTarget {
  /**
   * alias for EventTarget.addEventListener()
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} callback
   * @param {AddEventListenerOptions | boolean} options
   * @return {this}
   */
  on (type, callback, options) {
    this.addEventListener(type, callback, options);
    return this;
  }

  /**
   * Construct and dispatch an event
   * @param {string} type
   * @param {object} data
   * @returns {Boolean}
   */
  emit (type, data) {
    const event = new Event(type);
    Object.entries(data).forEach(([prop, value]) => {
      event[prop] = value;
    });

    return this.dispatchEvent(event);
  }
}
