'use strict';

const MessageEntity = require('../MessageEntity');

/**
 * Represents the poll
 */
class Poll {
  constructor(data) {
    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * Identifier of the poll
     * @type {string}
     */
    this.id = data.id;

    /**
     * Type of poll. This can be:
     * * regular
     * * quiz
     * @type {string}
     */
    this.type = data.type;

    /**
     * Poll question
     * @type {string}
     */
    this.question = data.question;

    /**
     * List of poll options
     * @type {Array[]}
     */
    this.options = data.options;

    if ('correct_option_id' in data) {
      /**
       * The index of the correct poll options
       * @type {?number}
       */
      this.correctOptionIndex = data.correct_option_id;
    }

    /**
     * Total number of users voted to the poll
     * @type {number}
     */
    this.totalVoters = data.total_voter_count;

    /**
     * Whether poll allows multiple answers or not
     * @type {boolean}
     */
    this.multipleChoices = data.allows_multiple_answers;

    if ('is_closed' in data) {
      /**
       * Whether the poll is closed or bot
       * @type {?boolean}
       */
      this.isClosed = data.is_closed;
    }

    if ('is_anonymous' in data) {
      /**
       * Whether the poll is anonymous or not
       * @type {?boolean}
       */
      this.isAnonymous = data.is_anonymous;
    }

    if ('explanation' in data) {
      /**
       * Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll
       * @type {?string}
       */
      this.explanation = data.explanation;
    }

    if ('explanation_entities' in data) {
      /**
       * Entities of explanation
       * @type {?MessageEntity}
       */
      this.entities = new MessageEntity({ content: this.explanation }, data.explanation_entities);
    }

    if ('open_period' in data) {
      /**
       * Amount of time in seconds the poll will be active after creation
       * @type {?number}
       */
      this.openPeriod = data.openPeriod;
    }

    if ('close_date' in data) {
      /**
       * Point in time (Unix timestamp) when the poll will be automatically closed
       * @type {?Date}
       */
      this.closeDate = data.closeDate;
    }
  }

  /**
   * Get correct poll option
   * @type {Object}
   */
  get correctOption() {
    return this.options[this.correctOptionIndex];
  }
}

module.exports = Poll;
