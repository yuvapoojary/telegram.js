import type * as T from '@telegramxjs/types';
import type { AnswerInlineQueryParams } from '@telegramxjs/types';
import { Base } from './Base.js';
import { User } from './User.js';

type AnswerOptions = Omit<AnswerInlineQueryParams, 'inline_query_id' | 'results'>;

/** An incoming inline query (when the user types `@yourbot ...`). */
export class InlineQuery extends Base<T.InlineQuery> {
  public get id(): string {
    return this.raw.id;
  }

  /** The user that issued the query. */
  public get author(): User {
    return new User(this.client, this.raw.from);
  }

  /** The text of the query (without the bot's @username). */
  public get query(): string {
    return this.raw.query;
  }

  /** The offset of the results to return (for pagination). */
  public get offset(): string {
    return this.raw.offset;
  }

  /** Send results for this inline query. */
  public answer(results: T.InlineQueryResult[], options: AnswerOptions = {}): Promise<boolean> {
    return this.client.api.answerInlineQuery({ inline_query_id: this.id, results, ...options });
  }
}
