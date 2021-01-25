'use strict';

const Base = require('./Base');
const User = require('./User');
const Permissions = require('../util/Permissions');

/**
 * Represents the ChatMember of a {@see Message}
 * @extends Base
 */
class ChatMember extends Base {
  /**
   * @param {Client} client The instantiated client
   * @param {string} chatId The id of the chat where this member belongs to
   * @param {Object} data
   */
  constructor(client, chatId, data) {
    super(client);

    /**
     * The instantiated client
     * @type {Client {
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The user id of the member
     * @type {number}
     */
    this.id = data.user.id

    /**
     * The id of the chat where this member belongs to
     * @type {number}
     */
    this.chatID = chatId;

    if ('user' in data) {
      /**
       * User object
       * @type {User}
       */
      this.user = new User(this.client, data.user);
    };

    if ('status' in data) {
      /**
       * The member's status in the chat. This can be 
       * * creator
       * * administrator
       * * member
       * * restricted
       * * left
       * * kicked
       * @type {string}
       */
      this.status = data.status;
    };

    if ('custom_title' in data) {
      /**
       * Custom title of the member.
       * @type {?string}
       */
      this.nickname = data.custom_title;
    };

    if ('is_anonymous' in data) {
      /**
       * Whether the user presence is hidden or not
       * @type {?Boolean}
       */
      this.anonymous = data.is_anonymous;
    };

    this.permissions = [];

    if ('unix_date' in data) {
      /**
       * Date when restrictions will be lifted for this user
       * @type {?Date}
       */
      this.unbansAt = data.unix_date;
    }
  };

  /**
   * Whether the user is banned/kicked
   * @type {Boolean}
   * @readonly
   */
  get isRestricted() {
    return this.unbansAt ? true : false;
  };

  /**
   * Fetch latest data of this member from telegram API
   * @returns {ChatMember}
   */
  fetch() {
    return this.client.api.getChatMember
      .get({
        query: {
          chat_id: this.chatID,
          user_id: this.id
        }
      })
      .then((data) => new ChatMember(this.client, this.chatID, data));
  };

  /**
   * Restrict a user by denying permissions
   * @param {Object} perms 
   * @param {PermissionResolvable} [perms.allow]
   * @param {PermissionResolvable} [perms.deny]
   * @param {Date} [perms.untilDate] 
   */
  restrict(perms) {
    const permissions = new Permissions()
      .allow(perms.allow)
      .deny(perms.deny);
    return this.client.api.restrictChatMember.post({
      data: {
        chat_id: this.chatID,
        user_id: this.id,
        permissions: permissions.toObject(),
        until_date: perms.untilDate || null
      }
    });
  };


  /**
   * Set/promote user permissions
   * @param {Object} perms 
   * @param {PermissionResolvable} [perms.allow]
   * @param {PermissionResolvable} [perms.deny]
   */
  setPermissions(perms = {}) {
    const permissions = new Permissions()
      .allow(perms.allow)
      .deny(perms.deny);
    return this.client.api.promoteChatMember.post({
      data: {
        chat_id: this.chatID,
        user_id: this.id,
        ...permissions.toObject()
      }
    })
  };

  /**
   * Set custom title for this chat
   * @type {string} name The new name to set
   * @returns {Promise<Boolean>}
   */
  setNickName(name) {
    return this.client.api.setChatAdministratorCustomTitle.post({
      data: {
        chat_id: this.chatID,
        user_id: this.id,
        custom_title: name
      }
    })
  };


};

module.exports = ChatMember;