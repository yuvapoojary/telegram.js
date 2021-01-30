'use strict';

const File = require('./File');

/**
 * Represents the voice
 * @extends {File}
 */
class Voice extends File {
  constructor(data = {}) {
    super(data);

    /**
     * Duration of the voice in seconds
     * @type {?number}
     */
    this.duration = data.duration || null;

    /**
     * Mime type of the voice
     * @type {?string}
     */
    this.mimeType = data.mime_type || null;
  }
}

module.exports = Voice;
