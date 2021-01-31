'use strict';

/**
 * Represents the markup button
 */
class MarkupButton {
  /**
   * Text button with optional callback
   * @param {string} content The text of the button
   * @param {string} [callbackData] The data to sent to the callback whene button is pressed
   * @returns {Object}
   */
  static text(content, callbackData) {
    return {
      text: content,
      callback_data: callbackData || content,
    };
  }

  /**
   * Shows a clickable button
   * @param {string} text The text of the link
   * @param {string} url A http url
   * @returns {Object}
   */
  static url(text, url) {
    return {
      text,
      url,
    };
  }

  /**
   * Shows a button which promts user to login
   * @param {string} text The text of the button
   * @param {string} url A http url
   * @param {string} [forward_text] The text for the forward message
   * @param {string} [bot_username] Bot username to show in the login prompt
   * @param {boolea} [request_write_access=false] Request write access
   * @returns {Object}
   */
  static login(text, url, forward_text, bot_username, request_write_access = false) {
    return {
      text,
      login_url: {
        url,
        forward_text,
        bot_username,
        request_write_access,
      },
    };
  }

  /**
   * Allows switching of a chat and places the specified query in the input box
   * @param {string} text Text of the button
   * @param {string} query Inline query to be sent when the button is pressed
   * @returns {Object}
   */
  static switchToChat(text, query = '') {
    return {
      text,
      switch_inline_query: query,
    };
  }

  /**
   * Places the specified query in the input box of the current chat
   * @param {string} text The text of the button
   * @param {string} query The inline query to be sent when the button is pressed
   * @returns {Object}
   */
  static inputQuery(text, query = '') {
    return {
      text,
      switch_inline_query_current_chat: query,
    };
  }
  /**
   * Callback game
   * @param {string} text The text of the button
   * @param {string} game
   * @returns {Object}
   */
  static callbackGame(text, game = {}) {
    return {
      text,
      callback_game: game,
    };
  }

  /**
   * Shows a pay button
   * @param {string} text The text of the pay button
   * @returns {Object}
   */
  static pay(text) {
    return {
      text,
      pay: true,
    };
  }

  /**
   * Request contact from the user
   * @param {string} text The text of the button
   * @returns {Object}
   */
  static requestContact(text) {
    return {
      text,
      request_contact: true,
    };
  }

  /**
   * Request location of the user
   * @param {string} text The text of the button
   * @returns {Object}
   */
  static requestLocation(text) {
    return {
      text,
      request_location: true,
    };
  }

  /**
   * Request user to do a poll
   * @param {string} text The text of the button
   * @param {string} [pollType=regular] Type of the poll to request. This can be either `regular` or `quiz`
   * @returns {Object}
   */
  static requestPoll(text, pollType = 'regular') {
    return {
      text,
      request_poll: {
        type: pollType,
      },
    };
  }
}

module.exports = MarkupButton;
