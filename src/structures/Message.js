const Base = require('./Base');
const User = require('./User');
const ClientUser = require('./ClientUser');
const DmChat = require('./DmChat');
const ChannelChat = require('./ChannelChat');

/**
 * Represents message
 * extends {Base}
 */

class Message extends Base {
  constructor(client, data) {
    super(client);
    this.client = client;
    this._patch(data);
  };

  _patch(data) {
    this.id = data.message_id;
    this.createdAt = data.date;
    this.editedAt = data.edited_date ? data.edited_date : null;
    // this.mentions = new Mentions(this, data.entities = []);

    if ('from' in data) {
      this.author = new User(this.client, data.from);
    } else {
      this.author = null;
    };


    if ('text' in data) {
      this.content = data.text;
    } else {
      this.content = null;
    };

    switch (data.chat.type) {
      case 'private':
        this.chat = new DmChat(this.client, data.chat)
        break;
      case 'channel':
        this.chat = new ChannelChat(this.client, data.chat);
        break;
    };

  };

  get edited() {
    return (this.editedAt ? true : false);
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