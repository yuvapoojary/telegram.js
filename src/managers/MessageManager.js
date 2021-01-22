const BaseManager = require('./BaseManager');
const Message = require('../structures/Message');

/**
 * Manages API methods of Message and stores their cache
 * @extends {BaseManager}
 */
class MessageManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Message);
  };

  /**
   * The cache of this manager
   * @type {Collection<Message>}
   * @name MessageManager#cache
   */
   
   
};

module.exports = MessageManager;