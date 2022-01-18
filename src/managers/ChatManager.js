'use strict';

const BaseManager = require('./BaseManager');
const Chat = require('../structures/Chat');
const ChatMember = require('../structures/ChatMember');
const Message = require('../structures/Message');

/**
 * Manages API methods of Chat and stores theirs cache
 * @extends {BaseManager}
 */
class ChatManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, Chat, client.options.chatCacheMaxSize);
  }

  /**
   * The cache of this manager
   * @type {Collection<Chat>}
   * @name ChatManager#cache
   */

  /**
   * Data that resolves to get Chat object. This can be:
   * * A Chat object
   * * A Chat Id
   * * A Message object (resolves to message.chat)
   * * A ChatMember object
   * @typedef {Chat|ChatMember|Message}
   */

  /**
   * Resolves a ChatResolvable to a Chat object
   * @param {ChatResolvable} chat The ChatResolvable to identify
   * @returns {?Chat}
   */
  resolve(chat) {
    if (chat instanceof Message) return chat.chat;
    if (chat instanceof ChatMember) return super.resolve(chat.chatID);
    return super.resolve(chat);
  }

  /**
   * Obtains a Chat from Telegram API
   * @param {Integer|string} id The id of the chat
   * @returns {Promise<Chat>}
   */
  fetch(id) {
    return this.client.api.getChat
      .get({
        query: {
          chat_id: id,
        },
      })
      .then(data => new Chat(this.client, data));
  }
}

module.exports = ChatManager;