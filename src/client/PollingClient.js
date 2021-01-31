'use strict';

/**
 * The polling client that is used to poll updates from telegram at specific intervals.
 */
class PollingClient {
  constructor(client) {
    this.client = client;
    this.options = client.options;
    this.lastUpdate = null;
    this.lastRequest = null;
    this.offset = client.options.pollingOffset || null;
    this.pollTimeout = null;
  }

  /**
   * Starts API polling
   * @returns {boolean}
   */
  start() {
    if (this.lastRequest) {
      return false;
    }
    this.poll();
    return true;
  }

  /**
   * Stops polling if running
   */
  stop() {
    this.client.clearTimeout(this.pollTimeout);
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
    }

    this.lastRequest = null;
  }

  poll() {
    this.client
      .getUpdates(
        this.offset && {
          offset: this.offset,
        },
      )
      .then(res => {
        if (res.length) this.offset = res[res.length - 1].update_id + 1;
        for (const data of res) {
          this.client.worker.processUpdate(data);
        }
      })
      .catch(err => {
        if (err.status === 404) return;
        throw err;
      })
      .finally(() => {
        this.pollTimeout = this.client.setTimeout(() => {
          this.poll();
        }, this.options.pollInterval);
      });
  }
}

module.exports = PollingClient;
