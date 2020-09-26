const HttpError = require('./HttpError');
const fetch = require('node-fetch');

/**
 * TODO: Handle ratelimites and queue up requests.
 */
 
class RequestHandler {
  constructor(client) {
    this.client = client;
    this.baseURL = 'https://api.telegram.org';
  }
  
  request(path, options) {
    this.client.debug(`Making [${options.method}] request to /${path}.`);
    const url = this.getFullPath(path);
    return fetch(url, options).
    then((res) => {
      if(res.ok) {
        try {
          return res.json();
        } catch(err) {
          throw new Error(`Failed to parse json response due to ${err.message}`);
        };
      }
      if(res.status == 429) {
        this.client.debug(`Ratelimited while ${options.method} request to /${path}`);
        this.client.emit('Ratelimit', {
          path: `/${path}`,
          method: options.method,
          status: res.status,
          headers: res.headers
        });
      };
    }).
    catch((err) => {
      throw new HttpError(err);
    });
  }
  
  getFullPath(path) {
    if(!this.client.token) {
      throw new Error('TELEGRAM BOT TOKEN NOT PROVIDED');
    }
    return `${this.baseURL}/bot${this.client.token}/${path}`;
  }
  
} 

module.exports = RequestHandler;
