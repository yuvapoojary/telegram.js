'use strict';

/** Represents the base structure
 */
class Base {
  /** 
   * @param {Client} client The instantiated client
   */
  constructor(client) {

    Object.defineProperty(this, 'client', { value: client, writable: true });
  }

  _patch(data) {
    return data;
  };

  _clone() {
    return Object.assign(Object.create(this), this);
  };

  _update(data) {
    const clone = this.clone();
    this._patch(data);
    return clone;
  };

  valueOf() {
    return this.id
  }

};

module.exports = Base;