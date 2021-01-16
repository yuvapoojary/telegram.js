const Base = require('./Base');
const User = require('./User');

class ChatMember extends Base {
  constructor (client, chat, data) {
    this.client = client;
    this.chat = chat;
    
    this.id = chat.user.id;
    
    if('user' in data) {
      this.user = new User(this.client, data.user);
    };
    
    if('status' in data) {
      this.status = data.status;
    };
    
    if('custom_title' in data) {
      this.nickname = data.custom_title;
    };
    
    if('is_anonymous' in data) {
      this.anonymous = data.is_anonymous;
    };
    
    this.permissions = [];
    
    if('unix_date' in data) {
      this.unbansAt = data.unix_date;
    }
  };
  
  get isRestricted() {
    return this.unbansAt ? true : false;
  };
 
  fetch() {
    return this.client.api.getChatMember
    .get({
      data: {
        chat_id: this.chat.id,
        user_id: this.chat.user.id
      }
    })
    .then((data) => new ChatMember(this.client, this.chat, data));
  };
  
  
  
};

module.exports = ChatMember;