'use strict';

const MarkupButton = require('./MarkupButton');
const Util = require('../util/Util');

/**
 * Represents the reply markup
 */
class Markup {
  constructor(data) {
    Object.assign(this, data);
  }

  /**
   * Button of the markup
   * @type {MarkupButton}
   */
  static get button() {
    return MarkupButton;
  }

  /**
   * When set to true the inine/keyboard will show to message author only
   * @param {boolean} [value=true]
   * @returns {Markup}
   */
  selective(value = true) {
    return new Markup({
      ...this,
      selective: value,
    });
  }

  /**
   * Resizes the keyboard
   * @param {boolean} [value=true]
   * @returns {Markup}
   */
  resize(value = true) {
    return new Markup({
      ...this,
      resize_keyboard: value,
    });
  }

  /**
   * Make keyboard shows only one time
   * @param {boolean} [value=true]
   * @returns {Markup}
   */
  oneTime(value = true) {
    return new Markup({
      ...this,
      one_time_keyboard: value,
    });
  }

  /**
   * Keyboard
   * @param {MarkupButton[]} data
   * @returns {Markup}
   */
  static keyboard(data) {
    return new Markup({
      keyboard: Markup.build(data),
    });
  }

  /**
   * Inline keyboard
   * @param {MarkupButton[]} data
   * @returns {Markup}
   */
  static inlineKeyboard(data) {
    return new Markup({
      inline_keyboard: Markup.build(data),
    });
  }

  /**
   * Removes keyboard menu
   * @param {boolean} [value=true]
   * @returns {Markup}
   */
  static removeKeyboard(value = true) {
    return new Markup({
      remove_keyboard: value,
    });
  }

  /**
   * Force reply
   * @param {boolean} [value=true]
   * @returns {Markup}
   */
  static forceReply(value = true) {
    return new Markup({
      force_reply: value,
    });
  }

  static build(data) {
    const array = [];
    if (Util.isDoubleArray(data)) {
      for (const row of data) {
        const rowArray = [];
        for (const text of row) {
          if (typeof text === 'string') {
            rowArray.push({
              text,
              callback_data: text,
            });
            break;
          }
          rowArray.push(text);
        }
        array.push(rowArray);
      }
    }

    for (const text of data) {
      if (typeof text === 'string') {
        array.push([
          {
            text,
            callback_data: text,
          },
        ]);
        break;
      }
      array.push([text]);
    }

    return array;
  }
}

module.exports = Markup;
