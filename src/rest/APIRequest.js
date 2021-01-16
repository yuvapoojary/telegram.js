const https = require('https');
const fetch = require('node-fetch');
const FormData = require('@discordjs/form-data');

if (https.agent) var agent = new https.agent({ keepAlive: true });

class APIRequest {
  constructor(rest, method, path, options) {
    this.rest = rest;
    this.method = method;
    this.path = path;
    this.options = options;
    this.querystring = '';

    if (options.query) {
      const query = Object.entries(options.query)
        .filter(([, value]) => value !== null && typeof value !== 'undefined')
        .flatMap(([key, value]) => (Array.isArray(value) ? value.map(v => [key, v]) : [[key, value]]));
      this.querystring = new URLSearchParams(query).toString();
    };

  };

  make() {
    const url = `${this.rest.endpoint}/${this.rest.getAuth()}${this.path}?${this.querystring && this.querystring}`;
    this.url = url;
    let headers = {};
    
    if(this.method === 'get') return fetch(url, {
      method: this.method,
      agent,
    });
    
    let body;
    if (this.options.files && this.options.files.length) {
      body = new FormData();
      for (const file of this.options.files)
        if (file && file.file) body.append(file.name, file.file, file.name);
      if (typeof this.options.data !== 'undefined') {
        for (const key in this.options.data) {
          body.append(key, this.options.data[key]);
        };
      };
      headers = Object.assign(headers, body.getHeaders());

    } else if (this.options.data != null) {
      body = JSON.stringify(this.options.data);
      headers['Content-Type'] = 'application/json';
    };


    return fetch(url, {
      headers,
      method: this.method,
      agent,
      body
    });
  };

};

module.exports = APIRequest;