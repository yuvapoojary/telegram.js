'use strict';

const File = require('./File');
const Photo = require('./Photo');

/**
 * Represents the document
 * @extends {File}
 */
class Document extends File {
  constructor(data = {}) {
    super(data);

    if ('file_name' in data) {
      /**
       * The document file name
       * @type {?string}
       */
      this.name = data.file_name;
    }

    if ('thumb' in data) {
      /**
       * Document thumbnail
       * @type {?Photo}
       */
      this.thumbnail = new Photo(data.thumb);
    }

    if ('mime_type' in data) {
      /**
       * Mime type of the document
       * @type {?string}
       */
      this.mimeType = data.mime_type;
    }
  }
}

module.exports = Document;
