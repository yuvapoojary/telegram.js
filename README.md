<div align="center">
<br />
<p>
<a href="https://telegram.js.org"><img src="https://yuvapoojary.github.io/telegram.js-website/img/logo.c274edc0.png"></a>
</p>
<br />
</div>

# telegram.js

A powerful, fully-typed Node.js library for the [Telegram Bot API](https://core.telegram.org/bots/api),
inspired by [discord.js](https://github.com/discordjs/discord.js).

- **100% API coverage** — every method and type is generated from the machine-readable Bot API
  spec, so the library is complete and stays current with each release. Currently tracks
  **Bot API 10.1**.
- **First-class TypeScript** — full types for every method, parameter, and object, with editor
  autocomplete everywhere.
- **Ergonomic OO layer** — familiar discord.js-style `Client`, events, and structures
  (`Message.reply()`, `Chat.send()`, keyboard builders) over a typed raw core.
- **Modern runtime** — native `fetch`/`FormData`, dual ESM + CommonJS, Node ≥ 18, zero heavy deps.

## Installation

```bash
npm install telegramxjs
```

## Quick start

```ts
import { Client, InlineKeyboardBuilder } from 'telegramxjs';

const client = new Client({ token: process.env.BOT_TOKEN });

client.on('ready', me => console.log(`Logged in as @${me.username}`));

client.on('message', async message => {
  if (message.text === '/start') {
    const keyboard = new InlineKeyboardBuilder().url('Docs', 'https://telegram.js.org').callback('Ping', 'ping');
    await message.reply('Welcome!', { reply_markup: keyboard.toJSON() });
  }
});

client.on('callbackQuery', async query => {
  if (query.data === 'ping') await query.answer({ text: 'Pong!' });
});

client.startPolling();
```

## The raw API

Every Bot API method is available, fully typed, on `client.api` — even ones without an ergonomic
wrapper. Parameters mirror the Telegram docs exactly (snake_case):

```ts
const me = await client.api.getMe();
await client.api.sendDice({ chat_id: chatId, emoji: '🎲' });
await client.api.setMyCommands({ commands: [{ command: 'start', description: 'Start the bot' }] });
```

## Sending files

Pass a `Buffer`, `Blob`, stream, or use `fileFrom()` for a local path:

```ts
import { fileFrom } from 'telegramxjs';

await client.api.sendPhoto({ chat_id: chatId, photo: fileFrom('./cat.jpg') });
```

## Webhooks

```ts
const client = new Client({ token: process.env.BOT_TOKEN });
await client.login();
await client.webhook.createServer('https://example.com/webhook', 8443, { secretToken: 'my-secret' });
```

## Staying current

The typed surface (`@telegramxjs/types`) is generated from
[`PaulSonOfLars/telegram-bot-api-spec`](https://github.com/PaulSonOfLars/telegram-bot-api-spec).
To upgrade to a new Bot API version:

```bash
npm run -w @telegramxjs/types generate -- --fetch   # download the latest spec and regenerate
```

See [MIGRATING.md](./MIGRATING.md) if you are upgrading from v1.

## Repository

This is an npm-workspaces + Turborepo monorepo:

| Package | Description |
| --- | --- |
| [`telegramxjs`](./packages/telegram.js) | The main library — `Client`, transports, events, and structures. |
| [`@telegramxjs/types`](./packages/types) | Generated Bot API types + method signatures (the typed core). |
| [`@telegramxjs/rest`](./packages/rest) | Low-level HTTP transport (`REST`, errors, file uploads). |
| [`@telegramxjs/builders`](./packages/builders) | Fluent keyboard/markup builders. |
| [`apps/website`](./apps/website) | The Next.js documentation site (renders the API reference). |

### Development

```bash
npm install            # install + link all workspaces
npm run build          # build every package (types → rest/builders → main) via Turborepo
npm run typecheck      # tsc across all packages
npm run lint           # eslint
npm test               # vitest, fanned out per package
npm run docs           # api-extractor doc models, then `npm run -w @telegramxjs/website build`
```

## Links

- [Website](https://telegram.js.org)
- [telegram.js Telegram](https://t.me/tlgrmjs)
- [GitHub](https://github.com/yuvapoojary/telegram.js)
- [NPM](https://npmjs.com/package/telegramxjs)

## License

Apache-2.0
