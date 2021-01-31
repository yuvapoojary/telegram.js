'use strict';

const File = require('./File');

/**
 * Represents the photo in a message
 * @extends {File}
 */
class Photo extends File {
  constructor(data = {}) {
    super(data);
    /**
     * Width of the photo
     * @type {number}
     */
    this.width = data.width;

    /**
     * Height of the photo
     * @type {number}
     */
    this.height = data.height;
  }
}

module.exports = Photo;
