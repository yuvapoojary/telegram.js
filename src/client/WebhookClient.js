'use strict';

const http = require('http');
const https = require('https');

/**
 * Represents the webhook client
 */
class WebhookClient {
  constructor(client) {
    Object.defineProperty(this, 'client', { value: client });

    this.server = null;
    this.path = null;
  };
  
  
  setPath(data) {
    this.path = data
  }

  createServer(path, port, host, tlsOptions) {
    this.path = path;
    this.server = tlsOptions ? https.createServer(tlsOptions, this.callback) : http.createServer(this.callback);
    this.server.listen(port, host);
  }

  callback(req, res) {
    if (req.url.indexOf(this.path) !== -1 || req.method !== 'POST') {
      res.statusCode = 418;
      res.end();
    } else {
      let chunks = '';
      req.setEncoding('utf-8');
      req.on('data', chunk => (chunks += chunk));
      req.on('end', () => {
        const json = JSON.parse(chunks);
        this.client.worker.processUpdate(json);
        res.statusCode = 200;
        res.end();
      });
    }
  }

  close() {
    if (this.server) this.server.close();
    this.server = null;
  }
}

module.exports = WebhookClient;
