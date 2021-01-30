'use strict';

const BaseManager = require('./BaseManager');
const ChatMember = require('../structures/ChatMember');

/**
 * Manages API methods of ChatMember and stores their cache
 * @extends {BaseManager}
 */
class ChatMemberManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, ChatMember, client.options.memberCacheMaxSize);
  }

  /**
   * The cache of this manager
   * @type {Collection<Message>}
   * @name ChatMemberManager#cache
   */
}

module.exports = ChatMemberManager;
