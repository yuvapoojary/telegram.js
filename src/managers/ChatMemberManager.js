'use strict';

const BaseManager = require('./BaseManager');
const ChatMember = require('../structures/ChatMember');

/**
 * Manages API methods of ChatMember and stores their cache
 * @extends {BaseManager}
 */
class ChatMemberManager extends BaseManager {
  constructor(client, chatId, iterable) {
    super(client, iterable, ChatMember, client.options.memberCacheMaxSize);

    this.chatId = chatId;
  }

  /**
   * The cache of this manager
   * @type {Collection<Message>}
   * @name ChatMemberManager#cache
   */

  fetch(id) {
    return this.client.api.getChatMember
      .get({
        query: {
          chat_id: this.chatId,
          user_id: id
        },
      })
      .then(data => new ChatMember(this.client, chatId, data));
  }
}

module.exports = ChatMemberManager;
