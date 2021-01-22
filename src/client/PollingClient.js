/**
 * The polling client that is used to poll updates from telegram at specific intervals.
 */
class PollingClient {
  constructor(client) {
    this.client = client
    this.options = client.options;
    this.lastUpdate = null;
    this.lastRequest = null;
    this.offset = client.options.pollingOffset || null;
    this.interval = client.options.interval || 1000;
    this.pollTimeout = null;
  }

  /**
   * Starts API polling 
   */
  start() {
    if (this.lastRequest) {
      return false;
    };
    this.poll();
    return true;
  };

  /**
   * Stops polling if running
   */
  stop() {
    this.client.clearTimeout(this.pollTimeout);
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
    };

    this.lastRequest = null;
  };


  poll() {
    this.client.getUpdates(this.offset && ({
        offset: this.offset
      }))
      .then((res) => {
        if (res.length) this.offset = res[res.length - 1].update_id + 1;
        for (const data of res) {
          this.client.worker._processData(data);
        };

      })
      .catch((err) => {
        console.log(err);
        if (err.status == 404) return;
        if (err.status == 409) {
          return this.client.removeWebhook()
            .then(() => this.poll());
        };
        throw err;
      })
      .finally(() => {
        this.pollTimeout = this.client.setTimeout(() => {
          this.poll();
        }, this.interval);
      });
  }

};

module.exports = PollingClient;