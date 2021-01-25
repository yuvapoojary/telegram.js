'use strict';

const BaseManager = require('./BaseManager');
const User = require('../structures/User');
console.log(User instanceof User);
/**
 * Manages API methods of User and stores their cache
 * @extends {BaseManager}
 */
class UserManager extends BaseManager {
  constructor(client, iterable) {
    super(client, iterable, User, client.options.userCacheMaxSize)
  };

  /**
   * The cache of this manager
   * @type {Collection<Message>}
   * @name UserManager#cache
   */


};

module.exports = UserManager;