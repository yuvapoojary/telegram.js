'use strict';

const Base = require('./Base');
const User = require('./User');
const Location = require('./Location');

/**
 * Represents the choosen result of InlineQuery
 * @extends {Base}
 */
class InlineChosenResult extends Base {
  constructor(client, data) {
    super(client);

    this.client = client;

    /**
     * The id of the choosen result
     * @type {string}
     */
    this.id = data.result_id;

    this._patch(data);
  };

  _patch(data) {

    /**
     * The user who choosen the inline query result
     * @type {User}
     */
    this.author = new User(this.client, data.from);

    /**
     * The query that was used to obtain the result
     * @type {string}
     */
    this.query = data.query;

    if ('inline_message_id' in data) {
      /**
       * Identifier of the sent inline message.
       * @type {?string}
       */
      this.inlineMessageId = data.inline_message_id;
    };

    if ('location' in data) {
      /**
       * Sender location, only for bots that require user location
       * @type {?Location}
       */
      this.location = new Location(data.location);
    };
  }
};

module.exports = InlineChosenResult;