'use strict';

const File = require('./File');
const Photo = require('./Photo');

/**
 * Represents the animation
 * @extends {File}
 */
class Animation extends File {
  constructor(data = {}) {
    super(data);

    /**
     * Width of the animation
     * @type {number}
     */
    this.width = data.width;

    /**
     * Height of the animation
     * @type {number}
     */
    this.height = data.height;

    /**
     * Duration of the animation in seconds
     * @type {number}
     */
    this.duration = data.duration;

    if ('file_name' in data) {
      /**
       * The animation/video file name
       * @type {?string}
       */
      this.name = data.file_name;
    };

    if ('thumb' in data) {
      /**
       * Animation thumbnail
       * @type {?Photo}
       */
      this.thumbnail = new Photo(data.thumb);
    };

    if ('mime_type' in data) {
      /**
       * Mime type of the animation
       * @type {?string}
       */
      this.mimeType = data.mime_type;
    };
  };
};

module.exports = Animation;