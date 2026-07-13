import type * as T from '@telegramxjs/types';
import { Base } from './Base.js';
import { User } from './User.js';

/** Information about one member of a chat. */
export class ChatMember extends Base<T.ChatMember> {
  /** The member's status in the chat (`creator`, `administrator`, `member`, ...). */
  public get status(): T.ChatMember['status'] {
    return this.raw.status;
  }

  /** The user this membership refers to. */
  public get user(): User {
    return new User(this.client, this.raw.user);
  }

  /** Whether this member has owner or administrator status. */
  public get isAdmin(): boolean {
    return this.raw.status === 'creator' || this.raw.status === 'administrator';
  }
}
