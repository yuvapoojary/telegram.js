# telegramxjs

A powerful, fully-typed Node.js library for the [Telegram Bot API](https://core.telegram.org/bots/api), inspired by [discord.js](https://github.com/discordjs/discord.js).

- **100% API coverage** — every method and type generated from the official Bot API spec.
- **First-class TypeScript** — full types for every method, parameter, and object.
- **Ergonomic OO layer** — a familiar `Client`, events, and structures (`Message.reply()`, keyboard builders) over a typed raw core.
- **Modern runtime** — native fetch/FormData, dual ESM + CommonJS, Node ≥ 18.

## Install

```bash
npm install telegramxjs
```

## Usage

```ts
import { Client, InlineKeyboardBuilder } from 'telegramxjs';

const client = new Client({ token: process.env.BOT_TOKEN });

client.on('ready', me => console.log(`Logged in as @${me.username}`));
client.on('message', message => {
  if (message.text) message.reply(`You said: ${message.text}`);
});

client.startPolling();
```

## Documentation

Full API reference: **https://telegram.js.org**

## License

[Apache-2.0](./LICENSE)
