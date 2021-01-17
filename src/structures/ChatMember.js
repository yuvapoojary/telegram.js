const Base = require('./Base');
const User = require('./User');

class ChatMember extends Base {
  constructor(client, chatId, data) {
    super(client);

    this.client = client;

    this.id = data.user.id
    
    this.chatID = chatId;
    
    if ('user' in data) {
      this.user = new User(this.client, data.user);
    };

    if ('status' in data) {
      this.status = data.status;
    };

    if ('custom_title' in data) {
      this.nickname = data.custom_title;
    };

    if ('is_anonymous' in data) {
      this.anonymous = data.is_anonymous;
    };

    this.permissions = [];

    if ('unix_date' in data) {
      this.unbansAt = data.unix_date;
    }
  };

  get isRestricted() {
    return this.unbansAt ? true : false;
  };

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


  restrict(perms, untilDate) {
    return this.client.api.restrictChatMember.post({
      data: {
        chat_id: this.chatID,
        user_id: this.id,
        permissions: perms,
        until_date: untilDate
      }
    });
  };


  promote(perms) {
    return this.client.api.promoteChatMember.post({
      data: {
        chat_id: this.chatID,
        user_id: this.id,
        ...perms
      }
    })
  };


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