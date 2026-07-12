import type * as T from '@telegramxjs/types';

/**
 * Fluent builder for a custom reply keyboard (`ReplyKeyboardMarkup`).
 *
 * @example
 * ```ts
 * const kb = new ReplyKeyboardBuilder()
 *   .text('Yes').text('No')
 *   .row()
 *   .requestContact('Share contact')
 *   .resize();
 * await chat.send('Choose:', { reply_markup: kb.toJSON() });
 * ```
 */
export class ReplyKeyboardBuilder {
  #rows: T.KeyboardButton[][] = [[]];
  #markup: Omit<T.ReplyKeyboardMarkup, 'keyboard'> = {};

  /** Add a fully-specified button to the current row. */
  public button(button: T.KeyboardButton): this {
    this.#rows[this.#rows.length - 1]!.push(button);
    return this;
  }

  /** Add a plain text button (sends its label as a message when tapped). */
  public text(text: string): this {
    return this.button({ text });
  }

  /** Add a button that requests the user's phone number. */
  public requestContact(text: string): this {
    return this.button({ text, request_contact: true });
  }

  /** Add a button that requests the user's location. */
  public requestLocation(text: string): this {
    return this.button({ text, request_location: true });
  }

  /** Add a button that asks the user to create a poll. */
  public requestPoll(text: string, type?: T.KeyboardButtonPollType['type']): this {
    return this.button({ text, request_poll: type ? { type } : {} });
  }

  /** Add a button that launches a Web App. */
  public webApp(text: string, url: string): this {
    return this.button({ text, web_app: { url } });
  }

  /** Start a new row of buttons. */
  public row(): this {
    this.#rows.push([]);
    return this;
  }

  /** Resize the keyboard to fit its buttons. */
  public resize(value = true): this {
    this.#markup.resize_keyboard = value;
    return this;
  }

  /** Hide the keyboard after one use. */
  public oneTime(value = true): this {
    this.#markup.one_time_keyboard = value;
    return this;
  }

  /** Keep the keyboard persistently open. */
  public persistent(value = true): this {
    this.#markup.is_persistent = value;
    return this;
  }

  /** Set the placeholder shown in the input field while the keyboard is active. */
  public placeholder(text: string): this {
    this.#markup.input_field_placeholder = text;
    return this;
  }

  /** Show the keyboard only to specific users in a group. */
  public selective(value = true): this {
    this.#markup.selective = value;
    return this;
  }

  /** Produce the `ReplyKeyboardMarkup` object, dropping any trailing empty row. */
  public toJSON(): T.ReplyKeyboardMarkup {
    return { ...this.#markup, keyboard: this.#rows.filter(row => row.length > 0) };
  }
}
