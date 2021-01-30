<div align="center">
<br />
<p>
<a href="https://yuvapoojary.github.io/telegram.js-website"><img src="https://yuvapoojary.github.io/telegram.js-website/img/logo.c274edc0.png">
</p>
<br />
</div>

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Example Usage](#example)
- [Links](#links)
- [Contributing](#contributing)
- [Help](#help)


## About

telegram.js is a powerful module that allows you to easily interact with the [Telegram Bot API](https://core.telegram.org/bots)

- Object-oriented
- Performant
- 99% coverage of telegram Bot API


## Installation

`npm install telegram.js`

## Example Usage

```js 
const Telegram = require('telegram.js');
const client = new Telegram.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}`);
});

client.on('message', (msg) => {
  if (msg.content === 'hii') {
    msg.reply('hello');
  };
});

client.commands.on('ping', (bot, msg, args) => {
  msg.chat.send('pong!');
});

client.login('token');


client.startPolling();

// OR

client.setWebhook('https://<PUBLIC_URL>/secretpath');

client.setupwebhook('/secretpath');
```

## Links

- [Website](https://telegram.js.org)
- [Telegram.js Telegram](https://t.me/tlgrmjs)
- [Telegram Bot Talk](https://t.me/BotTalk)
- [Github](https://github.com/yuvapoojary/telegram.js)
- [NPM](https://npmjs.com/package/telegram.js)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the
[documentation](https://telegram.js.org/#/docs).  
See [the contribution guide](https://github.com/yuvapoojary/telegram.js/blob/master/.github/CONTRIBUTING.md) if you'd like to submit a PR.

## Help

If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Telegram.js Server](https://t.me/tlgrmjs)