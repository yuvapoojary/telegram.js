/**
 * Opt-in integration smoke test against the real Telegram Bot API.
 *
 * Requires a bot token in TELEGRAM_TEST_TOKEN. Optionally set TELEGRAM_TEST_CHAT_ID to a
 * chat the bot can message to exercise sendMessage end-to-end.
 *
 *   TELEGRAM_TEST_TOKEN=123:abc TELEGRAM_TEST_CHAT_ID=456 node scripts/smoke.ts
 */
import { Client } from '../src/index.js';

const token = process.env.TELEGRAM_TEST_TOKEN;
if (!token) {
  process.stdout.write('TELEGRAM_TEST_TOKEN not set — skipping integration smoke.\n');
  process.exit(0);
}

const client = new Client({ token });

const me = await client.login();
process.stdout.write(`Logged in as @${me.username} (id ${me.id})\n`);

const chatId = process.env.TELEGRAM_TEST_CHAT_ID;
if (chatId) {
  const sent = await client.api.sendMessage({ chat_id: chatId, text: 'telegramx.js v2 smoke test ✅' });
  process.stdout.write(`Sent message ${sent.message_id} to chat ${chatId}\n`);
}

process.stdout.write('Smoke test passed.\n');
