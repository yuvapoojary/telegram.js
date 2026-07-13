import { describe, it, expect } from 'vitest';
import { InlineKeyboardBuilder } from '../src/InlineKeyboardBuilder.js';
import { ReplyKeyboardBuilder } from '../src/ReplyKeyboardBuilder.js';

describe('InlineKeyboardBuilder', () => {
  it('builds rows of buttons and drops trailing empty rows', () => {
    const kb = new InlineKeyboardBuilder()
      .url('Docs', 'https://telegram.js.org')
      .callback('Go', 'go')
      .row()
      .webApp('App', 'https://example.com')
      .row(); // trailing empty row

    expect(kb.toJSON()).toEqual({
      inline_keyboard: [
        [
          { text: 'Docs', url: 'https://telegram.js.org' },
          { text: 'Go', callback_data: 'go' },
        ],
        [{ text: 'App', web_app: { url: 'https://example.com' } }],
      ],
    });
  });
});

describe('ReplyKeyboardBuilder', () => {
  it('builds a keyboard with layout flags', () => {
    const kb = new ReplyKeyboardBuilder().text('Yes').text('No').row().requestContact('Contact').resize().oneTime();

    expect(kb.toJSON()).toEqual({
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [[{ text: 'Yes' }, { text: 'No' }], [{ text: 'Contact', request_contact: true }]],
    });
  });
});
