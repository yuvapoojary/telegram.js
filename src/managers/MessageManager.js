'use strict';

const BaseManager = require('./BaseManager');
let Message;

/**
 * Manages API methods of Message and stores their cache
 * @extends {BaseManager}
 */
class MessageManager extends BaseManager {
  constructor(client, iterable) {
    if (!Message) Message = require('../structures/Message');
    super(client, iterable, Message, client.options.messageCacheMaxSize);
  }

  /**
   * The cache of this manager
   * @type {Collection<Message>}
   * @name MessageManager#cache
   */
}

module.exports = MessageManager;
