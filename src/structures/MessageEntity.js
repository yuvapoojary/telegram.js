'use strict';

const Base = require('./Base');
const Collection = require('../util/Collection');
const User = require('./User');

/**
 * Entities parsed from {@link Message}
 */
class MessageEntity {
  constructor(message, data = []) {

    /**
     * Any users that were mentioned
     * @type {Collection<number, User>} 
     */
    this.users = new Collection();

    /**
     * Any mentions that were mentioned using their username
     * @type {Collection<string, Entity>}
     */
    this.mentions = new Collection();

    /**
     * Any hashtags(#) that were mentioned
     * @type {Collection<string, Entity>}
     */
    this.hashtags = new Collection();

    /**
     * Any cashtags($) that were mentioned
     * @type {Collection<string, Entity>}
     */
    this.cashtags = new Collection();

    /**
     * Any commands(/command) that were mentioned
     * @type {Collection<string, Entity>}
     */
    this.commands = new Collection();

    /**
     * Any urls that were mentioned
     * @type {Collection<string, Entity}
     */
    this.urls = new Collection();

    /**
     * Any emails that were mentioned
     * @type {Collection<string, Entity}
     */
    this.emails = new Collection();

    /**
     * Any phonenumbers that were mentioned
     * @type {Collection<string, Entity>}
     */
    this.phoneNumbers = new Collection();

    /**
     * Any hyperlinks that were mentioned
     * @type {Collection<string, Entity>}
     */
    this.links = new Collection();


    this._patch(message, data);

    /**
     * Get raw data of entities
     * @function
     * @name MessageEntity#getRaw
     */
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