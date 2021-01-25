'use strict';

const Base = require('./Base');
const User = require('./User');
const ClientUser = require('./ClientUser');
const Chat = require('./Chat');
const ChatMember = require('./ChatMember');
const MessageEntity = require('./MessageEntity');
const Location = require('./Location');

/**
 * Represents message in a chat
 * extends {Base}
 */
class Message extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The instantiated client
     */
    this.client = client;

    /**
     * The id of the message
     * @type {string}
     */
    this.id = data.id;

    if (data) this._patch(data);

  };

  _patch(data) {

    /**
     * The timestamp at which this message was created
     * @type {Date}
     */
    this.createdAt = data.date;

    /**
     * The timestamp at which this message was edited
     * @type {?Date}
     */
    this.editedAt = data.edited_date ? data.edited_date : null;

    if ('from' in data) {
      /**
       * The author of the message
       * @type {User}
       */
      this.author = new User(this.client, data.from);
    } else {
      this.author = null;
    };


    if ('text' in data) {
      /**
       * The text content of the message
       * @type {?string}
       */
      this.content = data.text;
    } else {
      this.content = null;
    };

    /**
     * The chat the message was sent in
     * @type {Chat}
     */
    this.chat = this.client.chats.add(data.chat, {});

    /**
     * Represents the author of message as chat member
     * @type {ChatMember}
     */
    this.member = this.chat.members.add({ user: data.from }, { id: this.author.id });

    /**
     * Represents the special entities that were with the message
     * @type {MessageEntity}
     */
    this.entities = new MessageEntity(this, data.entities || []);

    if ('reply_to_message' in data) {

      this.originalMessage = new Message(this.client, data.reply_to_message);
    };

    if ('sender_chat' in data) {
      this.senderChat = new Chat(this.client, data.sender_chat);
    };

    if ('forward_from_message_id' in data) {
      this.originalMessageId = data.forward_from_message_id
    };

    if ('forward_from' in data) {
      this.originalMessageAuthor = new User(this.client, data.forward_from);
    };

    if ('forward_signature' in data) {
      this.originalMessageSignature = data.forward_signature;
    };

    if ('forward_from_chat' in data) {
      this.originalMessageChat = new Chat(this.client, data.forward_from_chat);
    };

    if ('forward_sender_name' in data) {
      this.originalMessageSenderName = data.forward_sender_name;
    };

    if ('forward_date' in data) {
      this.originalMessageCreatedAt = data.forward_date;
    };

    if ('location' in data) {
      this.location = new Location(data.location);
    };

  };

  get edited() {
    return (this.editedAt ? true : false);
  };

  get isReply() {
    return this.originalMessage ? true : false;
  };

  get isForwarded() {
    if (this.originalMessageId || this.originalMessageChat || this.originalMessageAuthor || this.originalMessageSignature || this.originalMessageSenderName) return true;
    return false;
  };

  reply(content, options) {
    return this.chat.send(content, {
      ...options,
      reply_to_message_id: this.id
    })
  };

  forward(chatId, silent = false) {
    return this.client.api.forwardMessage.post({
        data: {
          chat_id: chatId,
          from_chat_id: this.chat.id,
          message_id: this.id,
          disable_notification: silent
        }
      })
      .then((data) => new Message(this.client, data));
  };

  copy(chatId, options = {}) {
    return this.client.api.copyMessage.post({
      data: {
        chat_id: chatId,
        from_chat_id: this.chat.id,
        message_id: this.id,
        ...options
      }
    });
  };

  pin(silent = false) {
    return this.client.api.pinChatMessage.post({
      data: {
        chat_id: this.chat.id,
        message_id: this.id,
        disable_notification: silent
      }
    });
  };

  unpin() {
    return this.client.api.unpinChatMessage.post({
      data: {
        chat_id: this.chat.id,
        message_id: this.id
      }
    });
  };

  delete() {
    return this.client.api.deleteMessage.post({
      data: {
        chat_id: this.chat.id,
        message_id: this.id
      }
    });
  };

};

module.exports = Message;