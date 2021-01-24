/**
 * Options for client
 * @typedef {Object} ClientOptions
 * @param {String} [apiURL=https://api.telegram.org] Base url of the telegram api
 * @param {number} [messageCacheMaxSize=200] Maximum number of messages to cache per chat (-1 or Infinity for unlimited)
 * @param {number} [chatCacheMaxSize=Infinity] Maximum number of chats to cache
 */
const ClientOptions = {
  apiURL: 'https://api.telegram.org',
  messageCacheMaxSize: 200,
  chatCacheMaxSize: Infinity
};



module.exports = { ClientOptions };

