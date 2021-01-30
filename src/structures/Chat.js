'use strict';

const Base = require('./Base');
const ChatMember = require('./ChatMember');
const MessageCollector = require('./MessageCollector');
const ChatMemberManager = require('../managers/ChatMemberManager');
const MessageManager = require('../managers/MessageManager');
const Util = require('../util/Util');
let Message;

/**
 * Represents Chat
 * extends {Base}
 */
class Chat extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data
   */
  constructor(client, data) {
    super(client, data);

    this.client = client;

    this.type = data.type;

    this.messages = new MessageManager(this.client);

    this.members = new ChatMemberManager(this.client);

    if (data) this._patch(data);
    if (!Message) Message = require('./Message');
  }

  _patch(data) {
    this.id = data.id;

    if ('title' in data) {
      this.title = data.title;
    }

    if ('username' in data) {
      this.username = data.username;
    }

    if ('description' in data) {
      this.description = data.description;
    }

    if ('invite_link' in data) {
      this.inviteURL = data.invite_link;
    }

    if ('slow_mode_delay' in data) {
      this.rateLimitPerUser = data.slow_mode_delay;
    }

    if ('first_name' in data) {
      this.firstName = data.first_name;
    }

    if ('last_name' in data) {
      this.lastName = data.last_name;
    }

    if ('bio' in data) {
      this.bio = data.bio;
    }
  }

  /**
   * Returns information about the authenticated bot in this chat
   * @returns {Promise<ChatMember>}
   */
  me() {
    return this.client.api.getChatMember
      .get({
        query: {
          chat_id: this.id,
          user_id: this.client.user.id,
        },
      })
      .then(data => new ChatMember(this.client, data));
  }

  /**
   * Fetches the fresh data of chat from telegram API
   * @returns {Promise<Chat>}
   */
  fetch() {
    return this.client.api.getChat
      .get({
        query: {
          chat_id: this.id,
        },
      })
      .then(data => new Chat(this.client, data));
  }

  /**
   * Send a message to the chat
   * @param {string} [content] The text to send
   * @param {MessageOptions} [options] The message options
   * @returns {Promise<Message>}
   * @example
   * client.on('message', (msg) => {
   * if(msg.content == 'hii') {
   *    msg.chat.send('Hello')
   * };
   * });
   */
  send(content, options) {
    return this.client.api.sendMessage
      .post({
        data: {
          chat_id: this.id,
          text: content,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(this.client, data));
  }

  /**
   * Send photo
   * @param {BufferResolvable} [photo]
   * @param {MessageOptions} [options] Options to send
   * @returns {Promise<Message>}
   * @example
   * // Using a local photo
   * chat.sendPhoto('./image.png');
   * // Using a url
   * chat.sendPhoto('https://example.com/image.png');
   * // Using a telegram file_id
   * chat.sendPhoto({ photo: 'file_id' })
   */
  sendPhoto(photo, options) {
    if (Util.isPlainObject(photo)) {
      options = photo;
      photo = null;
    }
    return this.client.api.sendPhoto
      .post({
        files: [{ name: 'photo', file: photo }],
        data: {
          chat_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(this.client, data));
  }

  /**
   * Send audio that is playable by the user
   * @param {BufferResolvable|Stream} [audio]
   * @param {MessageOptions} [options] Options to send
   * @returns {Promise<Message>}
   */
  sendAudio(audio, options = {}) {
    if (Util.isPlainObject(audio)) {
      options = audio;
      audio = null;
    }
    return this.client.api.sendAudio
      .post({
        files: audio && [{ name: 'audio', file: audio }],
        data: {
          chat_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => this.chat.messages.add(data, { id: data.message_id }));
  }

  /**
   * Send document
   * @param {BufferResolvable|Stream} [document] The document to send
   * @param {BufferResolvable|Stream} [thumbnail] Optinal thumbnail
   * @param {MessageOptions} [options]
   * @returns {Promise<Message>}
   */
  sendDocument(document, thumbnail, options) {
    if (Util.isPlainObject(document)) {
      options = document;
      document = null;
    }
    if (Util.isPlainObject(thumbnail)) {
      options = thumbnail;
      thumbnail = null;
    }
    return this.client.api.sendDocument
      .post({
        files: [
          { name: 'document', file: document },
          { name: 'thumb', file: thumbnail },
        ],
        data: {
          chat_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(data));
  }

  /**
   * Send video
   * @param {BufferResolvable|Stream} [video] The video to send
   * @param {BufferResolvable|Stream} [thumbnail] Optinal thumbnail
   * @param {MessageOptions} [options]
   * @returns {Promise<Message>}
   */
  sendVideo(video, thumbnail, options) {
    if (Util.isPlainObject(video)) {
      options = video;
      video = null;
    }
    if (Util.isPlainObject(thumbnail)) {
      options = thumbnail;
      thumbnail = null;
    }
    return this.client.api.sendVideo
      .post({
        files: [
          { name: 'video', file: video },
          {
            name: 'thumb',
            file: thumbnail,
          },
        ],
        data: {
          chat_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(data));
  }

  /**
   * Send video note
   * @param {BufferResolvable|Stream} [video] The video note to send
   * @param {BufferResolvable|Stream} [thumbnail] Optinal thumbnail
   * @param {MessageOptions} [options]
   * @returns {Promise<Message>}
   */
  sendVideoNote(video, thumbnail, options) {
    if (Util.isPlainObject(video)) {
      options = video;
      video = null;
    }
    if (Util.isPlainObject(thumbnail)) {
      options = thumbnail;
      thumbnail = null;
    }
    return this.client.api.sendVideoNote
      .post({
        files: video && [
          { name: 'video_note', file: video },
          {
            name: 'thumb',
            file: thumbnail,
          },
        ],
        data: {
          chat_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(data));
  }

  /**
   * Send animation
   * @param {BufferResolvable|Stream} [animation] The animation to send
   * @param {BufferResolvable|Stream} [thumbnail] Optinal thumbnail
   * @param {MessageOptions} [options]
   * @returns {Promise<Message>}
   */
  sendAnimation(animation, thumbnail, options) {
    if (Util.isPlainObject(animation)) {
      options = animation;
      animation = null;
    }
    if (Util.isPlainObject(thumbnail)) {
      options = thumbnail;
      thumbnail = null;
    }
    return this.client.api.sendAnimation
      .post({
        files: animation && [
          { name: 'animation', file: animation },
          {
            name: 'thumb',
            file: thumbnail,
          },
        ],
        data: {
          chat_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => this.chat.messages.add(data, { id: data.message_id }));
  }

  /**
   * Send voice
   * @param {BufferResolvable|Stream} [voice] The voice to send
   * @param {MessageOptions} [options]
   * @returns {Promise<Message>}
   */
  sendVoice(voice, options) {
    if (Util.isPlainObject(voice)) {
      options = voice;
      voice = null;
    }
    return this.client.api.sendDocument
      .post({
        files: voice && [{ name: 'voice', file: voice }],
        data: {
          chat_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(data));
  }

  /**
   * Send location
   * @param {number} latitude The latitude of location
   * @param {number} longitude The longitude of location
   * @param {MessageOptions} [options]
   * @returns {Promise<Message>}
   */
  sendLocation(latitude, longitude, options) {
    return this.client.api.sendLocation
      .post({
        data: {
          chat_id: this.id,
          latitude,
          longitude,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(data));
  }

  /**
   * Send media groups
   * @param {Array} media
   * @param {MessageOptions} [options]
   * @returns {Promise<Message[]>}
   */
  sendMediaGroup(media, options = {}) {
    return this.client.api.sendMediaGroup.post({
      data: {
        files: media,
        ...options,
      },
    });
  }

  sendContact(phoneNumber, firstName, lastName, options) {
    return this.client.api.sendContact
      .post({
        data: {
          chat_id: this.id,
          phone_number: phoneNumber,
          first_name: firstName,
          last_name: lastName,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(data));
  }

  /**
   * Send venue
   * @param {MessageOptions} options
   * @returns {Promise<Message>}
   */
  sendVenue(options) {
    return this.client.api.sendVenue
      .post({
        data: {
          chat_id: this.id,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(this.client, data));
  }

  /**
   * Send a poll
   * @param {string} question Question of the poll
   * @param {Array[]} answers Array of answers/options
   * @param {MessageOptions} [options]
   * @returns {Promise<Message>}
   */
  sendPoll(question, answers, options) {
    return this.client.api.sendPoll
      .post({
        data: {
          chat_id: this.id,
          question,
          options: answers,
          type: 'regular',
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(this.client, data));
  }

  /**
   * Send a quiz
   * @param {string} question Question of the quiz
   * @param {Array[]} answers Array of answers to the question
   * @param {number} answerIndex The index of the correct answer
   * @param {MessageOptions} [options]
   * @returns {Promise<Message>}
   */
  sendQuiz(question, answers, answerIndex, options) {
    return this.client.api.sendPoll
      .post({
        data: {
          chat_id: this.id,
          question,
          options: answers,
          type: 'quiz',
          correct_option_id: answerIndex,
          ...Util.parseOptions(options),
        },
      })
      .then(data => new Message(this.client, data));
  }

  /**
   * Show typing placeholder
   * @returns {Promise<booleam>}
   */
  startTyping() {
    return this.client.api.sendChatAction.post({
      data: {
        chat_id: this.id,
        action: 'typing',
      },
    });
  }

  /**
   * Send chat action when processing something
   * @param {string} action The action to send. This can be:
   * * typing
   * * upload_photo
   * * record_video
   * * upload_video
   * * record_voice
   * * upload_voice
   * * upload_document
   * * find_location
   * * record_video_note
   * * upload_video_note
   * @returns {Promise<boolean>}
   */
  sendChatAction(action) {
    return this.client.api.sendChatAction.post({
      data: {
        chat_id: this.id,
        action,
      },
    });
  }

  /**
   * Kicks a member from the chat
   * @param {string} userId The id of user to kick
   * @param {Date} [untilDate] The until date
   * @returns {Promise<boolean>}
   */
  kick(userId, untilDate) {
    let options = untilDate ? { until_date: untilDate } : {};
    return this.client.api.kickChatMember.post({
      data: {
        chat_id: this.id,
        user_id: userId,
        ...options,
      },
    });
  }

  /**
   * Unbans a user from the chat
   * @param {string} userId The id of the user to unban
   * @param {boolean} [force=false] If the user is not banned and force is set to true, the user will be kicked.
   * @returns {Promise<boolean>}
   */
  unban(userId, force = false) {
    return this.client.api.unbanChatMembet.post({
      data: {
        chat_id: this.id,
        user_id: userId,
        only_if_banned: !force,
      },
    });
  }

  /**
   * Set permissions of chat
   * @param {Array} perms The permission to allow
   * @returns {Promise<boolean>}
   */
  setPermissions(perms) {
    return this.client.api.setChatPermissions.post({
      data: {
        chat_id: this.id,
        permissions: perms,
      },
    });
  }

  /**
   * Creates an invite link of chat
   * @returns {Promise<string>}
   */
  createInvite() {
    return this.client.api.exportChatInviteLink.post({
      chat_id: this.id,
    });
  }

  /**
   * Sets title of chat
   * @param {string} title The title to set
   * @returns {Promise<boolean>}
   */
  setTitle(title) {
    return this.client.api.setChatTitle.post({
      data: {
        chat_id: this.id,
        title,
      },
    });
  }

  /**
   * Set description of the chat
   * @param {string} description
   * @returns {Promise<boolean>}
   */
  setDescription(description) {
    return this.client.api.setChatDescription.post({
      data: {
        chat_id: this.id,
        description,
      },
    });
  }

  /**
   * Set photo of the chat
   * @param {BufferResolvable} [photo]
   * @param {MessageOptions} options
   * @returns {Promise<boolean>}
   */
  setPhoto(photo, options = {}) {
    return this.client.api.setChatPhoto.post({
      data: {
        chat_id: this.id,
        ...options,
      },
      files: photo ? [{ name: 'photo', file: photo }] : null,
    });
  }

  /**
   * Delets chats photo
   * @returns {Promise<boolean>}
   */
  deletePhoto() {
    return this.client.api.deleteChatPhoto({
      data: {
        chat_id: this.id,
      },
    });
  }

  /**
   * Unpins all messages
   * @returns {Promise<boolean>}
   */
  unpinAllMessages() {
    return this.client.api.unpinAllChatMessages.post({
      data: {
        chat_id: this.id,
      },
    });
  }

  /**
   * Leaves bot from the chat
   * @returns {Promise<boolean>}
   */
  leave() {
    return this.client.api.leaveChat.post({
      data: {
        chat_id: this.id,
      },
    });
  }

  /**
   * Get list og chat admins
   * @returns {Promise<Array<ChatMember>>}
   */
  getAdmins() {
    return this.client.api.getChatAdministrators
      .get({
        query: {
          chat_id: this.id,
        },
      })
      .then(data => data.map(member => new ChatMember(member)));
  }

  /**
   * Returns member count of the chat
   * @returns {Promise<number>}
   */
  membersCount() {
    return this.client.api.getChatMembersCount.get({
      query: {
        chat_id: this.id,
      },
    });
  }

  /**
   * Add sticker set
   * @param {string} name Name of sticker set to add
   * @returns {Promise<boolean>}
   */
  addStickerSet(name) {
    return this.client.api.setChatStickerSet.post({
      data: {
        chat_id: this.id,
        sticket_set_name: name,
      },
    });
  }

  /**
   * Remove sticker set
   * @param {string} name Name of the sticker set to remove
   * @returns {Promise<boolean>}
   */
  removeStickerSet(name) {
    return this.client.api.deleteChatStickerSet.post({
      data: {
        chat_id: this.id,
        sticker_set_name: name,
      },
    });
  }

  /**
   * Creates a Message Collector.
   * @param {CollectorFilter} filter The filter to create the collector with
   * @param {MessageCollectorOptions} [options={}] The options to pass to the collector
   * @returns {MessageCollector}
   * @example
   * // Create a message collector
   * const filter = m => m.content.includes('telegram');
   * const collector = chat.createMessageCollector(filter, { time: 15000 });
   * collector.on('collect', m => console.log(`Collected ${m.content}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageCollector(filter, options = {}) {
    return new MessageCollector(this, filter, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {MessageCollectorOptions} AwaitMessagesOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createMessageCollector but in promise form.
   * Resolves with a collection of messages that pass the specified filter.
   * @param {CollectorFilter} filter The filter function to use
   * @param {AwaitMessagesOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<S
   * string, Message>>}
   * @example
   * // Await /vote messages
   * const filter = m => m.content.startsWith('/vote');
   * // Errors: ['time'] treats ending because of the time limit as an error
   * chat.awaitMessages(filter, { max: 4, time: 60000, errors: ['time'] })
   *   .then(collected => console.log(collected.size))
   *   .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
   */
  awaitMessages(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createMessageCollector(filter, options);
      collector.once('end', (collection, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }
}

module.exports = Chat;
