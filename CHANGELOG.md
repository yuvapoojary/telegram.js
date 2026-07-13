# Changelog

## 2.0.0

A complete TypeScript rewrite. See [MIGRATING.md](./MIGRATING.md) for upgrade guidance.

### Added

- **Full Bot API 10.1 coverage.** Every method (180) and object type (359) is generated from the
  machine-readable spec and fully typed. Regenerate with `npm run generate -- --fetch` to track new
  Bot API releases.
- Fully-typed raw client at `client.api.*` mirroring the official docs.
- Typed event system covering all 25 update types (reactions, business messages, chat members,
  join requests, boosts, payments, polls, and more).
- `InlineKeyboardBuilder` and `ReplyKeyboardBuilder` (discord.js-v14-style builders).
- Native file uploads via `Buffer`/`Blob`/stream/`fileFrom(path)`, including nested `attach://`
  handling for media groups, plus `rest.download()` for `getFile` downloads.
- 429 rate-limit handling with `retry_after`, request timeouts, and typed `TelegramError`/`HTTPError`.
- Dual ESM + CommonJS output with bundled `.d.ts` declarations.

### Changed

- Rewritten in TypeScript; requires Node ≥ 18.
- Replaced `node-fetch`, `@discordjs/form-data`, and `jimp` with native platform APIs.
- Structures expose ergonomic getters plus a `.raw` escape hatch to the full payload.
- Caching is now opt-in rather than mandatory.

### Removed

- `CommandManager` (`client.commands`).
- `Markup` / `MarkupButton` (replaced by the builders).
- Fixed long-standing v1 bugs (`unbanChatMembet` typo, `sendVoice` calling `sendDocument`,
  misnamed `editMessageLiveNotification`, `new Message(data)` missing the client argument).
