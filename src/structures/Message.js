const Base = require('./Base');
const User = require('./User');
const ClientUser = require('./ClientUser');
const Chat = require('./Chat');
const ChatMember = require('./ChatMember');
const MessageEntity = require('./MessageEntity');
const Location = require('./Location');

/**
 * Represents message
 * extends {Base}
 */

class Message extends Base {
  constructor(client, data) {
    super(client);
    this.client = client;
    if(data) this._patch(data);
  };

  _patch(data) {
    this.id = data.message_id;
    this.createdAt = data.date;
    this.editedAt = data.edited_date ? data.edited_date : null;

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
    

    this.chat = this.client.chats.cache.get(data.chat.id);
    this.chat ? this.chat._patch(data.chat) : (this.chat = new Chat(this.client, data.chat));
    
    this.member = new ChatMember(this.client, this.chat.id, { user: data.from });
    
    this.entities = new MessageEntity(this, data.entities || []);
    
    if('reply_to_message' in data) {
      this.originalMessage = new Message(this.client, data.reply_to_message);
    };
    
    if('sender_chat' in data) {
      this.senderChat = new Chat(this.client, data.sender_chat);
    };
    
    if('forward_from_message_id' in data) {
      this.originalMessageId = data.forward_from_message_id
    };
    
    if('forward_from' in data) {
      this.originalMessageAuthor = new User(this.client, data.forward_from);
    };
    
    if('forward_signature' in data) {
      this.originalMessageSignature = data.forward_signature;
    };
    
    if('forward_from_chat' in data) {
      this.originalMessageChat = new Chat(this.client, data.forward_from_chat);
    };
    
    if('forward_sender_name' in data) {
      this.originalMessageSenderName = data.forward_sender_name;
    };
    
    if('forward_date' in data) {
      this.originalMessageCreatedAt = data.forward_date;
    };
    
    if('location' in data) {
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
    if(this.originalMessageId || this.originalMessageChat || this.originalMessageAuthor || this.originalMessageSignature || this.originalMessageSenderName) return true;
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