'use strict';

const File = require('./File');
const Photo = require('./Photo');

/**
 * Represents the video note
 * @extends {File}
 */
class VideoNote extends File {
  constructor(data = {}) {
    super(data);

    /**
     * Diameter of the video message
     * @type {number}
     */
    this.length = data.length;

    /**
     * Duration of the video note in seconds
     * @type {number}
     */
    this.duration = data.duration;

    if ('thumb' in data) {
      /**
       * Thumbnail of video note
       * @type {?Photo}
       */
      this.thumbnail = new Photo(data.thumb);
    };

  };
};

module.exports = VideoNote;