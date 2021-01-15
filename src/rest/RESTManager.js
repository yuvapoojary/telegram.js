const APIRouter = require('./APIRouter');
const APIRequest = require('./APIRequest');

class RESTManager {
  constructor(client) {
    this.client = client;
  }

  get api() {
    return APIRouter(this);
  };

  get endpoint() {
    return this.client.options.ApiURL;
  };

  async request(method, path, options) {
    const handler = new APIRequest(this, method, path, options);
    let json;
    const res = await handler.make();
    try {
      json = await res.json();
    } catch (e) {
      throw new Error('Unable to parse api response');
    };
    console.log(json, handler.url);
    if (res.ok) return json;
    return Promise.reject(json);
  };

  getAuth() {
    return `bot${this.endpoint}`;
  };

}

module.exports = RESTManager;