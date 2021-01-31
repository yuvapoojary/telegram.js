'use strict';

const https = require('https');
const FormData = require('@discordjs/form-data');
const fetch = require('node-fetch');
const Util = require('../util/Util');

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
    }
  }

  async make() {
    const url = `${this.rest.endpoint}/${this.rest.getAuth()}${this.path}${this.querystring && `?${this.querystring}`}`;
    this.url = url;
    let headers = {};

    if (this.method === 'get') {
      return fetch(url, {
        method: this.method,
        agent,
      });
    }

    let body;
    if (this.options.files && this.options.files.length) {
      body = new FormData();
      for (const file of this.options.files) {
        if (file && file.file) {
          // eslint-disable-next-line
          const buffer = await Util.resolveBuffer(file.file);
          body.append(file.name, buffer);
        }
      }
      if (this.options.data) {
        for (const key in this.options.data) {
          body.append(key, JSON.stringify(this.options.data[key]));
        }
      }
      headers = Object.assign(headers, body.getHeaders());
    } else {
      body = JSON.stringify(this.options.data);
      headers['Content-Type'] = 'application/json';
    }

    this.rest.client.debug(`Making ${this.method} to ${this.path}`);
    return fetch(url, {
      headers,
      method: this.method,
      agent,
      body,
    });
  }
}

module.exports = APIRequest;