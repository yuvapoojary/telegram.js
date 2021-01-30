'use strict';

const Collector = require('../util/Collector');

/**
 * @typedef {CollectorOptions} MessageCollectorOptions
 * @property {number} max The maximum amount of messages to collect
 * @property {number} maxProcessed The maximum amount of messages to process
 */

/**
 * Collects messages on a chat.
 * @extends {Collector}
 */
class MessageCollector extends Collector {
  /**
   * @param {Chat} chat The chat
   * @param {CollectorFilter} filter The filter to be applied to this collector
   * @param {MessageCollectorOptions} options The options to be applied to this collector
   * @emits MessageCollector#message
   */
  constructor(chat, filter, options = {}) {
    super(chat.client, filter, options);

    /**
     * The channel
     * @type {TextBasedChannel}
     */
    this.chat = chat;

    /**
     * Total number of messages that were received in the channel during message collection
     * @type {number}
     */
    this.received = 0;

    this.client.incrementMaxListeners();
    this.client.on('message', this.handleCollect);

    this.once('end', () => {
      this.client.removeListener('message', this.handleCollect);
      this.client.decrementMaxListeners();
    });
  }

  /**
   * Handles a message for possible collection.
   * @param {Message} message The message that could be collected
   * @returns {?number}
   * @private
   */
  collect(message) {
    /**
     * Emitted whenever a message is collected.
     * @event MessageCollector#collect
     * @param {Message} message The message that was collected
     */
    if (message.chat.id !== this.chat.id) return null;
    this.received++;
    return message.id;
  }

  /**
   * Handles a message for possible disposal.
   * @param {Message} message The message that could be disposed of
   * @returns {?string}
   */
  dispose(message) {
    /**
     * Emitted whenever a message is disposed of.
     * @event MessageCollector#dispose
     * @param {Message} message The message that was disposed of
     */
    return message.chat.id === this.chat.id ? message.id : null;
  }

  /**
   * Checks after un/collection to see if the collector is done.
   * @returns {?string}
   * @private
   */
  endReason() {
    if (this.options.max && this.collected.size >= this.options.max) return 'limit';
    if (this.options.maxProcessed && this.received === this.options.maxProcessed) return 'processedLimit';
    return null;
  }
}

module.exports = MessageCollector;
