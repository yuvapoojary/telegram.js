'use strict';

const Base = require('./Base');
const Chat = require('./Chat');
const Location = require('./Location');
const MessageEntity = require('./MessageEntity');
const User = require('./User');
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
const Util = require('../util/Util');

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

    /**
     * The message type
     * @type {MessageTypes}
     */
    this.type = Util.messageTypes(this);
  }

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
    }

    if ('text' in data) {
      /**
       * The text content of the message
       * @type {?string}
       */
      this.content = data.text;
    } else {
      this.content = null;
    }

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
      /**
       * Original message if the message is reply
       * @type {?Message}
       */
      this.originalMessage = new Message(this.client, data.reply_to_message);
    }

    if ('sender_chat' in data) {
      /**
       * The chat where the message is forwarded from
       * @type {?Chat}
       */
      this.senderChat = new Chat(this.client, data.sender_chat);
    }

    if ('forward_from_message_id' in data) {
      /**
       * The id of the forwarded message
       * @type {?number}
       */
      this.originalMessageId = data.forward_from_message_id;
    }

    if ('forward_from' in data) {
      /**
       * The author of original/forwarded message
       * @type {?User}
       */
      this.originalMessageAuthor = new User(this.client, data.forward_from);
    }

    if ('forward_signature' in data) {
      /**
       * The author signature of the original/forwarded message
       * @type {?string}
       */
      this.originalMessageSignature = data.forward_signature;
    }

    if ('forward_from_chat' in data) {
      /**
       * The chat which the message is forwarded from
       * @type {?Chat}
       */
      this.originalMessageChat = new Chat(this.client, data.forward_from_chat);
    }

    if ('forward_sender_name' in data) {
      /**
       * The author name of the original/forwarded message
       * @type {?string}
       */
      this.originalMessageSenderName = data.forward_sender_name;
    }

    if ('forward_date' in data) {
      /**
       * The created time of original/forwarded message
       * @type {?Date}
       */
      this.originalMessageCreatedAt = data.forward_date;
    }

    if ('caption' in data) {
      /**
       * The caption of the message
       * @type {?string}
       */
      this.caption = data.caption;
    }

    if ('caption_entities' in data) {
      /**
       * The entities of the caption
       * @type {?MessageEntity}
       */
      this.captionEntities = new MessageEntity({ content: this.caption }, data.caption_entities);
    }

    if ('location' in data) {
      /**
       * The location of the message
       * @type {?Location}
       */
      this.location = new Location(data.location);
    }

    if ('animation' in data) {
      /**
       * The animation in the message
       * @type {?Animation}
       */
      this.animation = new Animation(data.animation);
    }

    if ('audio' in data) {
      /**
       * Audio message
       * @type {?Audio}
       */
      this.audio = new Audio(data.audio);
    }

    if ('document' in data) {
      /**
       * The document of the message
       * @type {?Document}
       */
      this.document = new Document(data.document);
    }

    if ('photo' in data) {
      /**
       * The photo of the message
       * @type {?Photo}
       */
      this.photo = data.photo.map(photo => new Photo(photo));
    }

    if ('video' in data) {
      /**
       * The video of the message
       * @type {?Video}
       */
      this.video = new Video(data.video);
    }

    if ('video_note' in data) {
      /**
       * The video note
       * @type {?VideoNote}
       */
      this.videoNote = new VideoNote(data.video_note);
    }

    if ('voice' in data) {
      /**
       * The voice message
       * @type {?Voice}
       */
      this.voice = new Voice(data.voice);
    }

    if ('sticker' in data) {
      /**
       * Sticker of the message
       * @type {?Sticker}
       */
      this.sticker = new Sticker(data.sticker);
    }

    if ('contact' in data) {
      /**
       * The contact message
       * @type {?Contact}
       */
      this.contact = new Contact(data.contact);
    }

    if ('poll' in data) {
      /**
       * The poll of the message
       * @type {?Poll}
       */
      this.poll = new Poll(data.poll);
    }

    if ('dice' in data) {
      /**
       * Dice in a message
       * @type {?Dice}
       */
      this.dice = new Dice(data.dice);
    }
  }

  /**
   * The timestamp at which the message was edited
   * @readonly
   * @type {Date}
   */
  get edited() {
    return !!this.editedAt;
  }

  /**
   * Checks, whether the message is a reply to another message
   * @readonly
   * @type {boolean}
   */
  get isReply() {
    return !!this.originalMessage;
  }

  /**
   * Checks, whether the message is forwarded
   * @readonly
   * @type {boolean}
   */
  get isForwarded() {
    if (
      this.originalMessageId ||
      this.originalMessageChat ||
      this.originalMessageAuthor ||
      this.originalMessageSignature ||
      this.originalMessageSenderName
    ) {
      return true;
    }
    return false;
  }

  /**
   * Reply to the current message
   * @param {string} [content] The text content to replay with
   * @param {MessageOptions} [options] Options
   * @returns {Message}
   */
  reply(content, options) {
    return this.chat
      .send(content, {
        ...options,
        reply_to_message_id: this.id,
      })
      .then(data => this.chat.messages.add(data));
  }

  /**
   * Edit message
   * @param {string} content The text content to edit
   * @param {MessageOptions} [options] Options
   * @returns {Promise<Message>}
   */
  edit(content, options) {
    return this.client.api.editMessageText
      .post({
        data: {
          text: content,
          chat_id: this.chat.id,
          message_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => {
        if (typeof data === 'boolean') return data;
        return this.chat.messages.add(data);
      });
  }

  /**
   * Forward the message to another chat
   * @param {number} chatId The id of chat
   * @param {boolean} [silent=false] Whether to disable notification or not
   * @returns {Message}
   */
  forward(chatId, silent = false) {
    return this.client.api.forwardMessage
      .post({
        data: {
          chat_id: chatId,
          from_chat_id: this.chat.id,
          message_id: this.id,
          disable_notification: silent,
        },
      })
      .then(data => new Message(this.client, data));
  }

  /**
   * Copy the message to another chat
   * @param {number} chatId The id of chat
   * @param {MessageOptions} [options] Options
   * @returns {Message}
   */
  copy(chatId, options) {
    return this.client.api.copyMessage.post({
      data: {
        chat_id: chatId,
        from_chat_id: this.chat.id,
        message_id: this.id,
        ...options,
      },
    });
  }

  /**
   * Pin the message in the chat
   * @param {boolean} [silent=false] Whether to disable notification
   * @returns {Promise<boolean>}
   */
  pin(silent = false) {
    return this.client.api.pinChatMessage.post({
      data: {
        chat_id: this.chat.id,
        message_id: this.id,
        disable_notification: silent,
      },
    });
  }

  /**
   * Unpin the message in the chat if pinned
   * @returns {Promise<boolean>}
   */
  unpin() {
    return this.client.api.unpinChatMessage.post({
      data: {
        chat_id: this.chat.id,
        message_id: this.id,
      },
    });
  }

  /**
   * Delete the message, requires `can_delete_messages` permission
   * @returns {Promise<boolean>}
   */
  delete() {
    return this.client.api.deleteMessage.post({
      data: {
        chat_id: this.chat.id,
        message_id: this.id,
      },
    });
  }

  /**
   * Edit live location of the message
   * @param {number} latitude The
   * latitude of the message
   * @param {number} longitude The
   * longitude of the location
   * @param {MessageOptions} [options] Options
   * @returns {Promise<Message|boolean>}
   */
  editLiveLocation(latitude, longitude, options = {}) {
    return this.client.api.editMessageLiveNotification
      .post({
        data: {
          chat_id: this.chat.id,
          message_id: this.id,
          latitude,
          longitude,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(this.client, data));
  }

  /**
   * Stops live sharing of location
   * @param {MessageOptions} [options] Options
   * @returns {Promise<Message|boolean>}
   */
  stopLiveLocation(options = {}) {
    return this.client.api.stopMessageLiveLocation
      .post({
        data: {
          chat_id: this.chat.id,
          message_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(this.client, data));
  }
}

module.exports = Message;
