# @telegramxjs/types

Fully-typed [Telegram Bot API](https://core.telegram.org/bots/api) types and method signatures, generated from the official spec. Part of [telegramxjs](https://www.npmjs.com/package/telegramxjs).

Includes every API object, method params/returns (`ApiMethods`), and metadata constants (`API_VERSION`, `METHOD_NAMES`, …). Most users get these re-exported from the main [`telegramxjs`](https://www.npmjs.com/package/telegramxjs) package.

## Install

```bash
npm install @telegramxjs/types
```

## Usage

```ts
import type { ApiMethods, Message } from '@telegramxjs/types';
import { API_VERSION } from '@telegramxjs/types';
```

## Documentation

Full API reference: **https://telegram.js.org**

## License

[Apache-2.0](./LICENSE)
