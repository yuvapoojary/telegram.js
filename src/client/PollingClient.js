/**
 * The polling client that is used to poll updates from telegram regularly. 
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
    console.log(this.offset);
    this.client.getUpdates({
      data: {
        offset: this.offset
      }
    })
      .then((res) => {
        this.offset = res[res.length - 1].update_id + 1;
        for(const data of res) {
          this.client._processUpdate(data);
        };
        
      })
      .catch((err) => {
        if(err.status == 404) return;
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