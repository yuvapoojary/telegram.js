const Base = require('./Base');
const ChatMember = require('./ChatMember');

/** 
 * Represents chat 
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
    if (data) this._patch(data);
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

  fetch() {
    return this.client.api.getChat(this.id)
      .then((data) => new Chat(this.client, data));
  };


  send(content, options = {}) {
    const Msg = require('./Message');
    return this.client.api.sendMessage.post({
        data: {
          chat_id: this.id,
          text: content,
          ...options
        }
      })
      .then((data) => new(require('./Message'))(this.client, data));
  };


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


  unban(userId, force = false) {
    return this.client.api.unbanChatMembet.post({
      data: {
        chat_id: this.id,
        user_id: userId,
        only_if_banned: !force
      }
    });
  };



  setPermissions(perms) {
    return this.client.api.setChatPermissions.post({
      data: {
        chat_id: this.id,
        permissions: perms
      }
    })
  };


  createInvite() {
    return this.client.api.exportChatInviteLink.post({
      chat_id: this.id
    });
  };


  setTitle(title) {
    return this.client.api.setChatTitle.post({
      data: {
        chat_id: this.id,
        title
      }
    });
  };


  setDescription(description) {
    return this.client.api.setChatDescription.post({
      data: {
        chat_id: this.id,
        description
      }
    });
  };


  setPhoto(photo) {
    return this.client.api.setChatPhoto.post({
      data: {
        chat_id: this.id
      },
      files: [{ name: photo, value: photo }]
    });
  };


  deletePhoto() {
    return this.client.api.deleteChatPhoto({
      data: {
        chat_id: this.id
      }
    });
  };


  unpinAllMessages() {
    return this.client.api.unpinAllChatMessages.post({
      data: {
        chat_id: this.id
      }
    });
  };


  leave() {
    return this.client.api.leaveChat.post({
      data: {
        chat_id: this.id
      }
    });
  };


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


  membersCount() {
    return this.client.api.getChatMembersCount.get({
      query: {
        chat_id: this.id
      }
    });
  };

  addStickerSet(name) {
    return this.client.api.setChatStickerSet.post({
      data: {
        chat_id: this.id,
        sticket_set_name: name
      }
    });
  };

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