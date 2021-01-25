'use strict';

const Base = require('./Base');
const ChatMember = require('./ChatMember');
const MessageManager = require('../managers/MessageManager');
const ChatMemberManager = require('../managers/ChatMemberManager');
let Message;

/** 
 * Represents Chat 
 * extends {Base}
 */
class Chat extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Message} message The message that is belongings to this chat
   */
  constructor(client, data) {
    super(client, data);

    this.client = client;

    this.type = data.type;

    this.messages = new MessageManager(this.client);

    this.members = new ChatMemberManager(this.client);

    if (data) this._patch(data);
    if (!Message) Message = require('./Message');
  };

  _patch(data) {

    this.id = data.id;

    if ('title' in data) {
      this.title = data.title;
    };

    if ('username' in data) {
      this.username = data.username;
    };

    if ('description' in data) {
      this.description = data.description;
    };

    if ('invite_link' in data) {
      this.inviteURL = data.invite_link;
    };

    if ('slow_mode_delay' in data) {
      this.rateLimitPerUser = data.slow_mode_delay;
    };

    if ('first_name' in data) {
      this.firstName = data.first_name;
    };

    if ('last_name' in data) {
      this.lastName = data.last_name
    };

    if ('bio' in data) {
      this.bio = data.bio;
    };

  };

  /**
   * Returns information about the authenticated bot in this chat
   * @returns {Promise<ChatMember>}
   */
  me() {
    return this.client.api.getChatMember.get({
        query: {
          chat_id: this.id,
          user_id: this.client.user.id
        }
      })
      .then((data) => new ChatMember(this.client, data));
  };

  /**
   * Fetches the fresh data of chat from telegram API
   * @returns {Promise<Chat>}
   */
  fetch() {
    return this.client.api.getChat.get({
        query: {
          chat_id: this.id
        }
      })
      .then((data) => new Chat(this.client, data));
  };

  /**
   * Send a message to the chat
   * @param {String} [content] The text to send
   * @param {MessageOptions} options The message options
   * @returns {Promise<Message>}
   */
  send(content, options = {}) {
    return this.client.api.sendMessage.post({
        data: {
          chat_id: this.id,
          text: content,
          ...options
        }
      })
      .then((data) => new Message(this.client, data));
  };


  /**
   * Kicks a member from the chat
   * @param {String} userId The id of user to kick
   * @param {Date} [untilDate] The until date 
   * @returns {Boolean}
   */
  kick(userId, untilDate) {
    let options = untilDate ? { until_date: untilDate } : {};
    return this.client.api.kickChatMember.post({
      data: {
        chat_id: this.id,
        user_id: userId,
        ...options
      }
    })
  };

  /**
   * Unbans a user from the chat
   * @param {String} userId The id of the user to unban
   * @param {Boolean} [force=false] If the user is not banned and force is set to true, the user will be kicked.
   * @returns {Promise<Boolean>}
   */
  unban(userId, force = false) {
    return this.client.api.unbanChatMembet.post({
      data: {
        chat_id: this.id,
        user_id: userId,
        only_if_banned: !force
      }
    });
  };

  /**
   * Set permissions of chat
   * @param {Array} perms The permission to allow
   * @returns {Promise<Boolean>}
   */
  setPermissions(perms) {
    return this.client.api.setChatPermissions.post({
      data: {
        chat_id: this.id,
        permissions: perms
      }
    })
  };

  /**
   * Creates an invite link of chat
   * @returns {Promise<String>}
   */
  createInvite() {
    return this.client.api.exportChatInviteLink.post({
      chat_id: this.id
    });
  };

  /**
   * Sets title of chat
   * @param {String} title The title to set
   * @returns {Promise<Boolean>}
   */
  setTitle(title) {
    return this.client.api.setChatTitle.post({
      data: {
        chat_id: this.id,
        title
      }
    });
  };

  /**
   * Set description of the chat
   * @param {String} description 
   * @returns {Promise<Boolean>}
   */
  setDescription(description) {
    return this.client.api.setChatDescription.post({
      data: {
        chat_id: this.id,
        description
      }
    });
  };

  /**
   * Set photo of the chat
   * @param {BufferResolvable} [photo]
   * @param {MessageOptions} options
   * @returns {Promise<Boolean>}
   */
  setPhoto(photo, options = {}) {
    return this.client.api.setChatPhoto.post({
      data: {
        chat_id: this.id,
        ...options
      },
      files: photo ? [{ name: 'photo', file: photo }] : null
    });
  };

  /**
   * Delets chats photo
   * @returns {Promise<Boolean>}
   */
  deletePhoto() {
    return this.client.api.deleteChatPhoto({
      data: {
        chat_id: this.id
      }
    });
  };

  /**
   * Unpins all messages
   * @returns {Promise<Boolean>}
   */
  unpinAllMessages() {
    return this.client.api.unpinAllChatMessages.post({
      data: {
        chat_id: this.id
      }
    });
  };

  /**
   * Leaves bot from the chat
   * @returns {Promise<Boolean>}
   */
  leave() {
    return this.client.api.leaveChat.post({
      data: {
        chat_id: this.id
      }
    });
  };

  /**
   * Get list og chat admins
   * @returns {Promise<Array<ChatMember>>}
   */
  getAdmins() {
    return this.client.api.getChatAdministrators.get({
        query: {
          chat_id: this.id
        }
      })
      .then((data) => {
        return data.map((member) => new ChatMember(member));
      });
  };

  /**
   * Returns member count of the chat
   * @returns {Promise<number>}
   */
  membersCount() {
    return this.client.api.getChatMembersCount.get({
      query: {
        chat_id: this.id
      }
    });
  };

  /**
   * Add sticker set
   * @param {string} name Name of sticker set to add
   * @returns {Promise<Boolean>}
   */
  addStickerSet(name) {
    return this.client.api.setChatStickerSet.post({
      data: {
        chat_id: this.id,
        sticket_set_name: name
      }
    });
  };

  /**
   * Remove sticker set
   * @param {String} name Name of the sticker set to remove
   * @returns {Promise<Boolean>}
   */
  removeStickerSet(name) {
    return this.client.api.deleteChatStickerSet.post({
      data: {
        chat_id: this.id,
        sticker_set_name: name
      }
    });
  };

};

module.exports = Chat;