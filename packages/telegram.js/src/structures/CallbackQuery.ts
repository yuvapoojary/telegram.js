import type * as T from '@telegramxjs/types';
import type { AnswerCallbackQueryParams } from '@telegramxjs/types';
import { Base } from './Base.js';
import { User } from './User.js';
import { Message } from './Message.js';

type AnswerOptions = Omit<AnswerCallbackQueryParams, 'callback_query_id'>;

/** An incoming callback query from a callback button on an inline keyboard. */
export class CallbackQuery extends Base<T.CallbackQuery> {
  public get id(): string {
    return this.raw.id;
  }

  /** The user that pressed the button. */
  public get author(): User {
    return new User(this.client, this.raw.from);
  }

  /** Data associated with the button (as set in `callback_data`). */
  public get data(): string | undefined {
    return this.raw.data;
  }

  /** The message the button belongs to, when still accessible. */
  public get message(): Message | undefined {
    const msg = this.raw.message;
    if (msg && 'date' in msg && msg.date !== 0) return new Message(this.client, msg as T.Message);
    return undefined;
  }

  /**
   * Answer this callback query. Call with no arguments to simply acknowledge it and stop the
   * loading spinner, or pass `{ text, show_alert }` to show a notification.
   */
  public answer(options: AnswerOptions = {}): Promise<boolean> {
    return this.client.api.answerCallbackQuery({ callback_query_id: this.id, ...options });
  }
}
