const Base = require('./Base');
const Collection = require('@discordjs/collection');
const User = require('./User');

class MessageEntity extends Base {
  constructor(message, data = []) {
    super(message.client);

    this.users = new Collection();
    this.mentions = new Collection();
    this.hashtags = new Collection();
    this.cashtags = new Collection();
    this.commands = new Collection();
    this.urls = new Collection();
    this.emails = new Collection();
    this.phoneNumbers = new Collection();
    this.links = new Collection();
    this._patch(message, data);
    this.getRaw = () => data;
  };

  _patch(message, data) {
    for (const entity of data) {
      if (entity.type === 'text_mention') {
        return this.users.set(entity.user.id, new User(message.client, entity.user));
      };
      const sliced = message.content.slice(entity.offset, 0);
     
      entity.id = message.content.slice(entity.offset, -(sliced.length - entity.length));
      
      switch (entity.type) {
        case 'mention':
          this.mentions.set(entity.id, entity);
          break;
        case 'hashtag':
          this.hashtags.set(entity.id, entity);
          break;
        case 'cashtag':
          this.cashtags.set(entity.id, entity);
          break;
        case 'bot_command':
          this.commands.set(entity.id, entity);
          break;
        case 'url':
          this.urls.set(entity.id, entity);
          break;
        case 'email':
          this.emails.set(entity.id, entity);
          break;
        case 'phone-number':
          this.phoneNumbers.set(entity.id, entity);
          break;
        case 'text_link':
          this.links.set(entity.id, entity);
          break;
        case 'bold':
          break;
        case 'italic':
          break;
        case 'underline':
          break;
        case 'strikethrough':
          break;
        case 'code':
          break;
        case 'pre':
          break;
      };
    };
  };

};

module.exports = MessageEntity;