const fs = require('fs');
const stream = require('stream');
const fetch = require('node-fetch');
const path = require('path');
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/**
 * Contains various usefull utility functions
 */

class Util {
  constructor() {
    throw new Error('The Util class may not be instantiated');
  }

  /**
   * Sets default properties on an object that aren't already specified.
   * @param {Object} def Default properties
   * @param {Object} given Object to assign defaults to
   * @returns {Object}
   * @private
   */
  static mergeDefault(def, given) {
    if (!given) return def;
    for (const key in def) {
      if (!has(given, key) || given[key] === undefined) {
        given[key] = def[key];
      } else if (given[key] === Object(given[key])) {
        given[key] = Util.mergeDefault(def[key], given[key]);
      }
    }

    return given;
  };


  /**
   * Data that can be resolved to give a Buffer. This can be:
   * * A Buffer
   * * The path to a local file
   * * A URL
   * @typedef {string|Buffer} BufferResolvable
   */

  /**
   * @external Stream
   * @see {@link https://nodejs.org/api/stream.html}
   */

  /**
   * Resolves a BufferResolvable to a Buffer or a Stream.
   * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
   * @returns {Promise<Buffer|Stream>}
   */
  static async resolveBuffer(resource) {
    if (Buffer.isBuffer(resource)) return resource;
    if (resource instanceof stream.Readable) return resource;

    if (typeof resource === 'string') {
      if (/^https?:\/\//.test(resource)) {
        const res = await fetch(resource);
        return res.body;
      } else if (true) {
        return new Promise((resolve, reject) => {
          const file = path.resolve(resource);
          fs.stat(file, (err, stats) => {
            if (err) return reject(err);
            if (!stats.isFile()) return reject(new Error('FILE_NOT_FOUND', file));
            return resolve(fs.createReadStream(file));
          });
        });
      }
    }

    throw new TypeError('REQ_RESOURCE_TYPE');
  }

}

module.exports = Util;