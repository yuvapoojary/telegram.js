/**
 * A minimal echo/ping bot. Run with:
 *   BOT_TOKEN=123:abc node --experimental-strip-types examples/ping.ts
 * (or import from the built package in your own project).
 */
import { Client, InlineKeyboardBuilder } from 'telegramxjs';

const client = new Client({ token: process.env.BOT_TOKEN });

client.on('ready', me => console.log(`Logged in as @${me.username}`));

client.on('message', async message => {
  if (message.text === '/start') {
    const keyboard = new InlineKeyboardBuilder().callback('Ping me', 'ping');
    await message.reply('Hello! Press the button.', { reply_markup: keyboard.toJSON() });
  } else if (message.text) {
    await message.reply(`You said: ${message.text}`);
  }
});

client.on('callbackQuery', async query => {
  if (query.data === 'ping') await query.answer({ text: 'Pong! 🏓' });
});

client.on('error', err => console.error('Client error:', err));

client.startPolling();
