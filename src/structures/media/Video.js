'use strict';

const File = require('./File');
const Photo = require('./Photo');

/**
 * Represents the video
 * @extends {File}
 */
class Video extends File {
  constructor(data = {}) {
    super(data);
    
    /**
     * Width of the video
     * @type {number}
     */
    this.width = data.width;
    
    /**
     * Height of the video
     * @type {number}
     */
    this.height = data.height;
    
    /**
     * Duration of the video in seconds
     * @type {number}
     */
    this.duration = data.duration;

    if ('file_name' in data) {
      /**
       * The video file name
       * @type {?string}
       */
      this.name = data.file_name;
    };

    if ('thumb' in data) {
      /**
       * Thumbnail of video
       * @type {?Photo}
       */
      this.thumbnail = new Photo(data.thumb);
    };

    if ('mime_type' in data) {
      /**
       * Mime type of the video
       * @type {?string}
       */
      this.mimeType = data.mime_type;
    };
  };
};

module.exports = Video;