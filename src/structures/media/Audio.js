'use strict';

const File = require('./File');
const Photo = require('./Photo');

/**
 * Represents the audio
 * @extends {File}
 */
class Audio extends File {
  constructor(data = {}) {
    super(data);

    /**
     * Duration of the audio in seconds
     * @type {number}
     */
    this.duration = data.duration;

    if ('title' in data) {
      /**
       * Title of the audio
       * @type {?string}
       */
      this.title = data.title;
    };

    if ('performer' in data) {
      /**
       * Performer of the audio
       * @type {?string}
       */
      this.performer = data.performer;
    };

    if ('file_name' in data) {
      /**
       * The audio file name
       * @type {?string}
       */
      this.name = data.file_name;
    };

    if ('thumb' in data) {
      /**
       * Thumbnail of the album cover to which the music file belongs
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

module.exports = Audio;