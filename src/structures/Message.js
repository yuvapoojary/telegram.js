'use strict';

const Base = require('./Base');
const User = require('./User');
const ClientUser = require('./ClientUser');
const Chat = require('./Chat');
const ChatMember = require('./ChatMember');
const MessageEntity = require('./MessageEntity');
const Location = require('./Location');
const Util = require('../util/Util');
const Animation = require('./media/Animation');
const Audio = require('./media/Audio');
const Contact = require('./media/Contact');
const Dice = require('./media/Dice');
const Document = require('./media/Document');
const Photo = require('./media/Photo');
const Poll = require('./media/Poll');
const Sticker = require('./media/Sticker');
const Video = require('./media/Video');
const VideoNote = require('./media/VideoNote');
const Voice = require('./media/Voice');

/**
 * Represents message in a chat
 * extends {Base}
 */
class Message extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The instantiated client
     * @type {Client}
     */
    this.client = client;

    /**
     * The id of the message
     * @type {string}
     */
    this.id = data.message_id;

    if (data) this._patch(data);
    
    this.type = Util.messageTypes(this);
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
      this.author = this.client.users.add(data.from);
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
    this.chat = this.client.chats.add(data.chat);

    /**
     * Represents the author of message as chat member
     * @type {ChatMember}
     */
    this.member = this.chat.members.add(this.chat.id, { id: data.from.id, extras: [{ user: data.from }] });

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

    if ('caption' in data) {
      this.caption = caption;
    };

    if ('caption_entities' in data) {
      this.captionEntities = new MessageEntity({ content: this.caption }, data.caption_entities);
    };

    if ('location' in data) {
      this.location = new Location(data.location);
    };

    if ('animation' in data) {
      this.animation = new Animation(data.animation);
    };

    if ('audio' in data) {
      this.audio = new Audio(data.audio);
    };

    if ('document' in data) {
      this.document = new Document(data.document);
    };

    if ('photo' in data) {
      this.photo = data.photo.map((photo) => new Photo(photo));
    };

    if ('video' in data) {
      this.video = new Video(data.video);
    };

    if ('video_note' in data) {
      this.videoNote = new VideoNote(data.video_note);
    };

    if ('voice' in data) {
      this.voice = new Voice(data.voice);
    };

    if ('sticker' in data) {
      this.sticker = new Sticker(data.sticker);
    };

    if ('contact' in data) {
      this.contact = new Contact(data.contact);
    };

    if ('poll' in data) {
      this.poll = new Poll(data.poll);
    };

    if ('dice' in data) {
      this.dice = data.dice;
    };

  };

  /**
   * The timestamp at which the message was edited
   * @readonly
   * @type {Date}
   */
  get edited() {
    return (this.editedAt ? true : false);
  };

  /**
   * Checks, whether the message is a reply to another message
   * @readonly
   * @type {boolean}
   */
  get isReply() {
    return this.originalMessage ? true : false;
  }

  /**
   * Checks, whether the message is forwarded
   * @readonly
   * @type {boolean}
   */
  get isForwarded() {
    if (this.originalMessageId || this.originalMessageChat || this.originalMessageAuthor || this.originalMessageSignature || this.originalMessageSenderName) return true;
    return false;
  };

  /**
   * Reply to the current message
   * @param {strin} [content] The text content to replay with
   * @param {MessageOptions} [options]
   * @returns {Message}
   */
  reply(content, options) {
    return this.chat.send(content, {
        ...options,
        reply_to_message_id: this.id
      })
      .then((data) => this.chat.messages.add(data));
  };

  /**
   * Edit message 
   * @param {string} content The text content to edit
   * @param {MessageOptions} [options]
   */
  edit(content, options) {
    return this.client.api.editMessageText.post({
        data: {
          text: content,
          chat_id: this.chat.id,
          message_id: this.id,
          ...Util.parseOptions(options)
        }
      })
      .then((data) => {
        if (typeof data == 'boolean') return data;
        return this.chat.messages.add(data);
      });
  };

  /**
   * Forward the message to another chat
   * @param {number} chatId The id of chat
   * @param {Boolean} [silent=false] Whether to disable notification or not
   * @returns {Message}
   */
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

  /**
   * Copy the message to another chat
   * @param {number} chatId The id of chat
   * @param {MessageOptions} [options]
   * @returns {Message}
   */
  copy(chatId, options) {
    return this.client.api.copyMessage.post({
      data: {
        chat_id: chatId,
        from_chat_id: this.chat.id,
        message_id: this.id,
        ...options
      }
    });
  };

  /**
   * Pin the message in the chat
   * @param {Boolean} [silent=false] Whether to disable notification 
   * @returns {Promise<boolean>}
   */
  pin(silent = false) {
    return this.client.api.pinChatMessage.post({
      data: {
        chat_id: this.chat.id,
        message_id: this.id,
        disable_notification: silent
      }
    });
  };

  /**
   * Unpin the message in the chat if pinned
   * @returns {Promise<boolean>}
   */
  unpin() {
    return this.client.api.unpinChatMessage.post({
      data: {
        chat_id: this.chat.id,
        message_id: this.id
      }
    });
  };

  /**
   * Delete the message, requires `can_delete_messages` permission
   * @returns {Promise<boolean>}
   */
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