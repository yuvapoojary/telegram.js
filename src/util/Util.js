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
  };

  /**
   * Options for sending message
   * @typedef {Object} MessageOptions
   * @property {string} [mode] Parsing mode. This can be:
   * * MarkdownV2
   * * Markdown
   * * HTML
   * @property {boolean} [silent=false] Whether to disable notification while sending message
   * @property {Array} [entities] Array of special entities that appear in message text, which can be specified instead of parse_mode ({@link https://core.telegram.org/bots/api#messageentity})
   * @property {boolean} [embedLinks=true] Whether to enable links preview or not
   * @property {number} [reply] If the message is a reply, ID of the original message
   * @property {boolean} [force] Pass True, if the message should be sent even if the specified replied-to message is not found
   * @property {ReplyMarkup} [markup] Reply markups
   * @property {...*} [others] Other options for specific method
   */

  static parseOptions(options = {}) {

    const defaults = {
      silent: false,
      embedLinks: true,
      force: true
    };

    options = Util.mergeDefault(defaults, options);

    const { embedLinks, silent, force, mode, entities, reply, markup, ...others } = options;

    const body = {
      disable_web_page_preview: !embedLinks,
      disable_notification: silent,
      allow_sending_without_reply: force
    };

    if (mode) body.parse_mode = mode;
    if (reply) body.reply_to_message_id = reply;
    if (markup) body.reply_markup = markup;
    return { ...body, ...others };
  };

  static isPlainObject(obj) {
    if (Buffer.isBuffer(obj)) return false;
    if (obj instanceof stream.Readable) return false;
    if (typeof obj === 'object') return true;
    return false;
  };

  /**
   * Type of message. This can be:
   * * text
   * * photo
   * * audio
   * * video
   * * vudeoNote
   * * voice
   * * animation
   * * sticker
   * * contact
   * * document
   * * dice
   * * poll
   * * location
   * @type {string}
   */
  static messageTypes(msg) {
    const Types = ['text', 'photo', 'audio', 'video', 'videoNote', 'voice', 'animation', 'sticker', 'contact', 'document', 'dice', 'poll', 'location'];
    return Types.filter((type) => {
      if (type === 'text' && msg.content) return type;
      if (msg.hasOwnProperty(type)) return type;
    })[0];
  };
  
  static isDoubleArray(array) {
    return Array.isArray(array[0]);
  };

}

module.exports = Util;