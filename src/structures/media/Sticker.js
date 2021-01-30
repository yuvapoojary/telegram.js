'use strict';

const File = require('./File');
const Photo = require('./Photo');

/**
 * Represents the sticker.
 * @extends {File}
 */
class Sticker extends File {
  constructor(data = {}) {
    super(data);

    /**
     * Width of the sticker
     * @type {number}
     */
    this.width = data.width;

    /**
     * Height of the sticker
     * @type {number}
     */
    this.height = data.height;

    /**
     * Whether the sticker is animated or not
     * @type {boolean}
     */
    this.isAnimated = data.is_animated;

    if ('thumb' in data) {
      /**
       * Thumbnail of the sticker
       * @type {?Photo}
       */
      this.thumbnail = new Photo(data.thumb);
    };

    if ('emoji' in data) {
      /**
       * The emoji of the sticker
       * @type {?string}
       */
      this.emoji = data.emoji;
    };

    if ('set_name' in data) {
      /**
       * Sticker set name
       * @type {?string}
       */
      this.setName = data.set_name;
    };

    if ('mask_position' in data) {
      /**
       * Mask position
       * @type {Object}
       */
      this.maskPosition = data.mask_position;
    };
  };

};

module.exports = Sticker;