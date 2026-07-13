# @telegramxjs/rest

Low-level HTTP transport for the [Telegram Bot API](https://core.telegram.org/bots/api). Handles auth, JSON vs. multipart bodies, file uploads, timeouts (including long polling), and 429 retries. Part of [telegramxjs](https://www.npmjs.com/package/telegramxjs).

Most users should use the main [`telegramxjs`](https://www.npmjs.com/package/telegramxjs) package, which wraps this transport with a typed OO layer.

## Install

```bash
npm install @telegramxjs/rest
```

## Usage

```ts
import { REST } from '@telegramxjs/rest';

const rest = new REST(process.env.BOT_TOKEN);
const me = await rest.api.getMe();
```

## Documentation

Full API reference: **https://telegram.js.org**

## License

[Apache-2.0](./LICENSE)
