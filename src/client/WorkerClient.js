'use strict';

const Message = require('../structures/Message');
const InlineQuery = require('../structures/InlineQuery');
const InlineChosenResult = require('../structures/InlineChosenResult');
const CallbackQuery = require('../structures/CallbackQuery');

/**
 * Represents the worker structure
 */
class Worker {
  constructor(client) {
    this.client = client;
  };

  /**
   * Process the data from telegram API
   * @param {Object} data
   * @see {https://core.telegram.org/bots/api#update|Telegram Bot API}
   */
  processUpdate(data) {
    this.client.emit('raw', data);
    if (data.message && data.message.new_chat_members) return this.onChatMemberAdd(data.message);
    if (data.message && data.message.left_chat_member) return this.onChatMemberRemove(data.message);
    if (data.message || data.channel_post) this.onMessage(data.message || data.channel_post);
    if (data.edited_message || data.edited_channel_post) this.onMessageEdit(data);
    if (data.callback_query) this.onCallbackQuery(data.callback_query);
    if (data.inline_query) this.onInlineQuery(data.inline_query);
    if (data.chosen_inline_result) this.onInlineQueryResult(data.chosen_inline_result);
  };

  onMessage(data) {
    const message = new Message(this.client, data);
    const chat = this.client.chats.cache.get(message.chat.id);
    /**
     * Emitted whenever a message created
     * @event Client#message
     * @param {Message} message The created message
     */
    this.client.emit('message', message);
    if (chat) chat.messages.add(data);
    if (!message.content || message.content.indexOf(this.client.commands.prefix) !== 0) return;
    const args = message.content.slice(this.client.commands.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    this.client.commands.trigger(command, message, args);
  };

  onMessageEdit(data) {
    const newMessage = new Message(this.client, data);
    const oldMessage = newMessage.chat.messages.cache.get(newMessage.id);
    /**
     * Emitted whenever a message is updated/edited
     * @event Client#messageUpdate
     * @param {Message} [oldMessage] The message before the update
     * @param {Message} [newMessage] The message after the edit/update
     */
    this.client.emit('messageUpdate', oldMessage, newMessage);
  };

  onCallbackQuery(data) {
    /**
     * Emitted whenever a callback query is triggered
     * @event Client#callbackQuery
     * @param {CallbackQuery} callbackQuery The incoming callback query
     */
    this.client.emit('callbackQuery', new CallbackQuery(this.client, data));
  };


  onInlineQuery(data) {
    /**
     * Emitted whenever a inline query is triggered
     * @event Client#inlineQuery
     * @param {InlineQuery} inlineQuery The incoming inline query
     */
    this.client.emit('inlineQuery', new InlineQuery(this.client, data));
  };

  onInlineChosenResult(data) {
    /**
     * Emitted whenever a inline query result is chosen
     * @event Client#inlineChosenResult
     * @param {InlineChosenResult} inlineResult The result that was chosen
     */
    this.client.emit('inlineChosenResult', new InlineChosenResult(this.client, data));
  };

  onChatMemberAdd(data) {
    for (const user of data.new_chat_members) {
      const author = data.from && this.client.users.add(data.from);
      const chat = this.client.chats.add(data.chat);
      const member = chat.members.add(chat.id, { id: user.id, extras: [{ user }] });
      /**
       * Emitted whenever bot joins a new chat
       * @event Client#chatCreate
       * @param {Chat} chat The joined chat
       * @param {?User} [author] The user who added the bot
       */
      if (user.id === this.client.user.id) return this.client.emit('chatCreate', chat, author);
      /**
       * Emitted whenever a member is added to the chat
       * @event Client#chatMemberAdd
       * @param {Chat} chat The chat where the member was added
       * @param {ChatMember} member The member who joined the chat
       * @param {?User} [author] The admin user who added the member
       */
      this.client.emit('chatMemberAdd', chat, member, author);
    };
  };

  onChatMemberRemove(data) {
    const author = data.from && this.client.users.add(data.from);
    const chat = this.client.chats.add(data.chat);
    const user = this.client.users.add(data.left_chat_member);
    /**
     * Emitted whenever bot leaves a chat
     * @event Client#chatDelete
     * @param {Chat} chat The chat from which bot was removed
     * @param {?User} [author] The user who removed/kicked the bot
     */
    if (user.id === this.client.user.id) return this.client.emit('chatDelete', chat, author);
    /**
     * Emitted whenever a member is removed from the chat
     * @event Client#chatMemberRemove
     * @param {Chat} chat The member that has left/been kicked from the chat
     * @param {ChatMember} member The member who was kicked/leaved
     * @param {?User} [author] The user who kicked the member
     */
    this.client.emit('chatMemberRemove', chat, chat.members.add(chat.id, { id: user.id, extras: [{ user }] }), author);
  };
};

module.exports = Worker;