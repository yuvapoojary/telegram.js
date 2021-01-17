# Welcome

Welcome to the telegram.js documentation.

## About

telegram.js is a powerful [Node.js](https://nodejs.org) module that allows you to easily interact with the
[Telegram Bot API](https://core.telegram.org/bots/api).

- Object-oriented
- Predictable abstractions
- Performant
- 100% coverage of Telegeam Bot API

## Installation

with npm: `npm install telegram.js`
with yarn: `yarn add telegram.js`

## Example Usage

```js
const Telegram = require('telegram.js');
const client = new Telegram.client();

client.on('message', (msg) => {
  if(msg.content == 'ping') {
    msg.reply('Pong!');
  }
});

client.login('token');

client.startPolling();
```

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://telegram.js.org/#/docs).  
See [the contribution guide](https://github.com/yuvapoojary/telegram.js/blob/master/.github/CONTRIBUTING.md) if you'd like to submit a PR.

