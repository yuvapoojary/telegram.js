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

};

module.exports = Message;