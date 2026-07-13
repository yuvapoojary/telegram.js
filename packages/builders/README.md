# @telegramxjs/builders

Fluent builders for [Telegram Bot API](https://core.telegram.org/bots/api) keyboards and markup. Part of [telegramxjs](https://www.npmjs.com/package/telegramxjs).

Most users get these re-exported from the main [`telegramxjs`](https://www.npmjs.com/package/telegramxjs) package.

## Install

```bash
npm install @telegramxjs/builders
```

## Usage

```ts
import { InlineKeyboardBuilder } from '@telegramxjs/builders';

const keyboard = new InlineKeyboardBuilder()
  .url('Open docs', 'https://telegram.js.org')
  .callback('Ping', 'ping');
```

## Documentation

Full API reference: **https://telegram.js.org**

## License

[Apache-2.0](./LICENSE)
