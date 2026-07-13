# Migrating from v1 to v2

telegramx.js v2 is a full TypeScript rewrite. It is a **breaking release** — the public API has
changed to be typed, complete, and consistent with the current Bot API. This guide covers the
changes most likely to affect existing bots.

## Runtime & packaging

- **Node ≥ 18** is now required (native `fetch`/`FormData`; `node-fetch`/`jimp` are gone).
- Ships as **dual ESM + CommonJS** with bundled type declarations. Both `import` and `require` work.
- The published package contains only compiled `dist/` output; import from the package root.

## Client

| v1 | v2 |
| --- | --- |
| `new Telegram.Client()` then `client.login('token')` | `new Client({ token })` then `client.login()` (or pass the token to `login`) |
| `client.startPolling()` | `client.startPolling(options?)` — or `await client.login()` then `client.polling.start()` |
| `client.user.username` after `ready` | same — `ready` now fires with the `ClientUser` as its argument |

## Events

Events are now typed. Message-like updates deliver a `Message` structure; the rest deliver the raw,
fully-typed Bot API object.

- `message` still fires with a `Message`, but read the text via `message.text` (was `msg.content`).
- New events cover the modern API: `editedMessage`, `channelPost`, `messageReaction`,
  `chatMember`, `myChatMember`, `chatJoinRequest`, `businessMessage`, `poll`, `pollAnswer`,
  `preCheckoutQuery`, `shippingQuery`, `chatBoost`, and more.
- `rawUpdate` fires for every update before the specific event.

## Messages & chats

- `msg.reply(text, options?)` and `chat.send(text, options?)` remain, now fully typed. Options are
  the Telegram parameters (snake_case) minus the ids the method fills in for you.
- `msg.content` → `msg.text`. The complete raw payload is always available at `msg.raw`.
- `chat.kick` / the old `unbanChatMembet` typo → `chat.banMember` / `chat.unbanMember`.

## Keyboards

The old `Markup`/`MarkupButton` classes are replaced by builders:

```ts
// v1
const markup = new Markup().inlineKeyboard([[MarkupButton.url('Docs', url)]]);

// v2
const markup = new InlineKeyboardBuilder().url('Docs', url).toJSON();
```

## The raw API

The biggest addition: **every** Bot API method is available and typed on `client.api`, mirroring the
official docs exactly. Anything without an ergonomic wrapper is still one call away:

```ts
await client.api.sendInvoice({ chat_id, title, description, payload, currency, prices });
await client.api.createForumTopic({ chat_id, name: 'Support' });
await client.api.sendGift({ user_id, gift_id });
```

## Removed

- `CommandManager` (`client.commands`) — command routing is left to the application. Match on
  `message.text` in a `message` handler, or use a routing library of your choice.
- `jimp`-based image helpers — pass files directly (`Buffer`/`Blob`/stream/`fileFrom(path)`).
