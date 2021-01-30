'use strict';

const Base = require('./Base');
const Message = require('./Message');
const User = require('./User');

/**
 * Represents the CallbackQuery
 * @extends {Base}
 */
class CallbackQuery extends Base {
  constructor(client, data) {
    super(client);

    this.client = client;

    /**
     * The id of callback query
     * @type {string}
     */
    this.id = data.id;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The user who triggered the callback query
     * @type {User}
     */
    this.author = new User(this.client, data.from);

    if ('message' in data) {
      /**
       * The message with the callback
       * button that originated the query.
       * Note that message content and
       * message date will not be
       * available if the message is too
       * old
       * @type {?Message}
       */
      this.message = new Message(this.client, data.message);
    }

    if ('inline_message_id' in data) {
      /**
       * Identifier of the message sent
       * via the bot in inline mode, that
       * originated the query.
       * @type {?string}
       */
      this.inlineMessageId = data.inline_message_id;
    }

    if ('chat_instance' in data) {
      /**
       * Global identifier, uniquely
       * corresponding to the chat to
       * which the message with thehort
       * name of a Game to be returned,
       * serves as the unique identifier
       * for the game callback button was
       * sent. Useful for high scores in
       * games.
       * @type {?string}
       */
      this.chatInstance = data.chat_instance;
    }

    if ('data' in data) {
      /**
       * Data associated with the
       * callback button. Be aware that a
       * bad client can send arbitrary
       * data in this field
       * @type {?string}
       */
      this.data = data.data;
    }

    if ('game_short_name' in data) {
      /**
       * Short name of a Game to be
       * returned, serves as the unique
       * identifier for the game
       * @type {?string}
       */
      this.gameShortName = data.game_short_name;
    }
  }

  /**
   * Send answers to the callback query
   * @param {string} content The text
   * content to send
   * @param {Object} [options] Options to
   * send
   * @param {boolean} [options.show_alert] Whether to show an
   * alert instead of notification
   * @param {string} [options.url] URL that will
   * be opened by the user's client
   * @param {number} [options.cache_time]
   * The
   * maximum amount of time in seconds
   * that the result of the callback
   * query may be cached client-side,
   * defaults to 0.
   * @returns {Promise<boolean>}
   */
  send(content, options = {}) {
    return this.client.api.answerCallbackQuery.post({
      data: {
        callback_query_id: this.id,
        text: content,
        ...options,
      },
    });
  }
}

module.exports = CallbackQuery;
