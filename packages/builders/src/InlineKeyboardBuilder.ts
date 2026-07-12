import type * as T from '@telegramxjs/types';

/**
 * Fluent builder for an inline keyboard (`InlineKeyboardMarkup`). Buttons are added to the
 * current row; call {@link InlineKeyboardBuilder.row} to start a new one.
 *
 * @example
 * ```ts
 * const kb = new InlineKeyboardBuilder()
 *   .url('Docs', 'https://telegram.js.org')
 *   .callback('Click me', 'clicked')
 *   .row()
 *   .webApp('Open app', 'https://example.com');
 * await chat.send('Menu', { reply_markup: kb.toJSON() });
 * ```
 */
export class InlineKeyboardBuilder {
  #rows: T.InlineKeyboardButton[][] = [[]];

  /** Add a fully-specified button to the current row. */
  public button(button: T.InlineKeyboardButton): this {
    this.#rows[this.#rows.length - 1]!.push(button);
    return this;
  }

  /** Add a URL button. */
  public url(text: string, url: string): this {
    return this.button({ text, url });
  }

  /** Add a button that sends a callback query with `data`. */
  public callback(text: string, data: string): this {
    return this.button({ text, callback_data: data });
  }

  /** Add a button that launches a Web App. */
  public webApp(text: string, url: string): this {
    return this.button({ text, web_app: { url } });
  }

  /** Add a button that logs the user in via Telegram Login. */
  public login(text: string, loginUrl: T.LoginUrl): this {
    return this.button({ text, login_url: loginUrl });
  }

  /** Add a button that switches to inline mode in a chosen chat. */
  public switchInline(text: string, query = ''): this {
    return this.button({ text, switch_inline_query: query });
  }

  /** Add a button that switches to inline mode in the current chat. */
  public switchInlineCurrent(text: string, query = ''): this {
    return this.button({ text, switch_inline_query_current_chat: query });
  }

  /** Add a button that copies text to the clipboard. */
  public copyText(text: string, copy: string): this {
    return this.button({ text, copy_text: { text: copy } });
  }

  /** Add a Pay button (for invoices). */
  public pay(text: string): this {
    return this.button({ text, pay: true });
  }

  /** Start a new row of buttons. */
  public row(): this {
    this.#rows.push([]);
    return this;
  }

  /** Produce the `InlineKeyboardMarkup` object, dropping any trailing empty row. */
  public toJSON(): T.InlineKeyboardMarkup {
    return { inline_keyboard: this.#rows.filter(row => row.length > 0) };
  }
}
