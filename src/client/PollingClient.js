/**
 * The polling client that is used to poll updates from telegram regularly. 
 */

class PollingClient {
  constructor(client) {
    this.client = client
    this.options = client.options;
    this.lastUpdate = null;
    this.lastRequest = null;
    this.offset = client.options.pollingOffset || 0;
    this.interval = client.options.interval || 1000;
    this.pollTimeout = null;
    
  }

  start() {
    if (this.lastRequest) {
      return false;
    };
    this.poll();
    return true;
  };

  stop() {
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
    };
    this.lastRequest = null;
  }

  poll() {
    this.client.getUpdates({
      offset: 511254214
    })
      .then((res) => {
        this.offset = res[res.length - 1].update_id + 1;
        for(const data of res) {
          this.client._processUpdate(data);
        };
        
      })
      .catch((err) => {
        if (err.status == 409) {
          return this.client.removeWebhook()
            .then(() => this.poll());
        };
        throw err;
      })
      .finally(() => {
        this.pollTimeout = setTimeout(() => {
          this.poll();
        }, this.interval);
      });
  }

};

module.exports = PollingClient;