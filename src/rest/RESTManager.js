'use strict';

const APIRequest = require('./APIRequest');
const APIRouter = require('./APIRouter');
const HTTPError = require('./HTTPError');
const TelegramAPIError = require('../errors/TelegramAPIError');

class RESTManager {
  constructor(client) {
    this.client = client;
  }

  get api() {
    return APIRouter(this);
  }

  get endpoint() {
    return this.client.options.apiURL;
  }

  async request(method, path, options = {}) {
    const handler = new APIRequest(this, method, path, options);
    let res;
    let result;

    try {
      res = await handler.make();
    } catch (err) {
      throw new HTTPError(err.message, err.constructor.name, err.status, method, path);
    }

    try {
      result = await this.parseResponse(res);
    } catch (err) {
      throw new HTTPError(err.message, err.constructor.name, err.status, method, path);
    }
    
    this.client.debug(`Got ${res.status} from request to path ${path}`);
    if (res.ok && result.ok) return result.result;

    throw new TelegramAPIError(path, result, `${method}`, res.status);
  }

  getAuth() {
    return `bot${this.client.token}`;
  }

  parseResponse(res) {
    if (res.headers.get('content-type').startsWith('application/json')) return res.json();
    return res.buffer();
  }
}

module.exports = RESTManager;
