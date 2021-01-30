'use strict';

const Base = require('./Base');
const Location = require('./Location');

/**
 * Represents the InlineQuery
 * @extends {Base}
 */
class InlineQuery extends Base {
  constructor(client, data) {
    super(client);

    this.client = client;

    /**
     * The id of the inline query
     * @type {string}
     */
    this.id = data.id;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The user who triggered the inline query
     * @type {User}
     */
    this.author = this.client.users.add(data.from);

    /**
     * Text of the query
     * @type {string}
     */
    this.query = data.query;

    /**
     * Offset of the results to be returned
     * @type {string}
     */

    if ('location' in data) {
      /**
       * Sender location, only for bots
       * that request user location
       * @type {?Location}
       */
      this.location = new Location(data.location);
    }
  }

  /**
   * Send results to inline query
   * @param {Array} results Array of
   * InlineQueryResult
   * @param {Object} [options] Options for
   * sending inline query result
   * @param {number} [options.cache_tim
   * =300] The maximum amount of time in
   * seconds that the result of the inline
   * query may be cached on the server.
   * @param {boolean} [options.is_personnel] Pass true, if results
   * may be cached on the server side only
   * for the user that sent the query
   * @param {string} [options.next_offset]
   * Pass the offset that a client should
   * send in the next query with the same
   * text to receive more results
   * @param {string} [options.switch_pm_text] If passed, clients
   * will display a button with specified
   * text that switches the user to a
   * private chat with the bot and sends
   * the bot a start message with the
   * parameter
   * @param {string} [options.switch_pm_parameter] Deep-linking
   * parameter for the /start message sent
   * to the bot when user presses the
   * switch button
   * @returns {Promise<boolean>}
   */
  send(results, options = {}) {
    return this.client.api.answerInlineQuery.post({
      data: {
        inline_query_id: this.id,
        results,
        ...options,
      },
    });
  }
}

module.exports = InlineQuery;
