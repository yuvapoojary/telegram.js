'use strict';

/**
 * Options for a client
 * @typedef {Object} ClientOptions
 * @property {string} [apiURL=https://ap
 * .telegram.org] Base url of the telegram
 * api
 * @property {number} [messageCacheMaxSiz
 * =200] Maximum number of messages to
 * cache per chat (-1 or Infinity for
 * unlimited)
 * @property {number} [chatCacheMaxSiz
 * =Infinity] Maximum number of chats to
 * cache
 * @property {number} [memberCacheMaxSize
 * =200] Maximum number of members to
 * cache per chat
 * @property {number} [userCacheMaxSiz
 * =1000] Maximum number of users to cache
 */
const ClientOptions = {
  apiURL: 'https://api.telegram.org',
  messageCacheMaxSize: 200,
  chatCacheMaxSize: Infinity,
  memberCacheMaxSize: 200,
  userCacheMaxSize: 1000,
};

module.exports = { ClientOptions };
