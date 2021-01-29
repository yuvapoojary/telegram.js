'use strict';

const fetch = require('node-fetch');
const TelegramAPIError = require('../../errors/TelegramAPIError');

/**
 * Represents the file in a message
 */
class File {
  constructor(data) {

    this.bufferResolvable = null;

    /**
     * Identifier of the file
     * @type {string}
     */
    this.id = data.file_id;

    /**
     * Unique identifier for this file, which is supposed to be the same over time and for different bots
     * @type {string}
     */
    this.uniqueId = data.file_unique_id;

    /**
     * Size of the file
     * @type {?number}
     */
    this.size = data.file_size || null;

    if ('file_path' in data) {
      /**
       * Path of the file
       * @type {?string}
       */
      this.path = data.file_path;
    };
  };

  /**
   * Url of the file
   * @returns {?string}
   */
  get url() {
    if (!this.path) return null;
    return `https://api.telegram.org/file/bot${this.client.token}/${this.path}`;
  };

  /**
   * Set file
   * @param {BufferResolvable|Stream} file The file to set
   */
  async setFile(file) {
    this.bufferResolvable = file;
    return this;
  };

  /**
   * Fetch the file from API.
   * @param {string} id The identifier of the file
   * @returns {Promise<File>}
   */
  fetch() {
    return fetch(this.url)
      .then(async (res) => {
        const result = await res.json();
        if (!result.ok) throw new TelegramAPIError('/getFile', result, 'get', res.status);
        return new File(result.result);
      });
  };

  /**
   * Download the file
   * @returns {Promise<Stream>}
   */
  download() {
    return fetch(this.url)
      .then((res) => res.body);
  };

};

module.exports = File;