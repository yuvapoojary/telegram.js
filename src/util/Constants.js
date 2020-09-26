/**
 * options for client
 * @typedeaf {Object} ClientOptions
 */

export.DefaultOptions = {
  cacheMessages: true,
  debug: false,

  /**
   * polling options
   * @typedeaf {Object} pollingOptions
   * @property {boolean} [enabled=true] Whether to enable polling
   * @property {number} [interval=300] Interval for polling updates from telegram (in ms - do not set too low interval)
   */
  polling: {
    enabled: true,
    interval: 300,
  }
};