'use strict';

/**
 * Represents the dice in a message
 */
class Dice {
  constructor(data) {
    this.emoji = data.emoji;
    this.value = data.value;
  };
};

module.exports = Dice;