import type * as T from '@telegramxjs/types';
import { Base } from './Base.js';

/** A Telegram user or bot. */
export class User extends Base<T.User> {
  /** Unique identifier for this user or bot. */
  public get id(): number {
    return this.raw.id;
  }

  /** Whether this user is a bot. */
  public get isBot(): boolean {
    return this.raw.is_bot;
  }

  public get firstName(): string {
    return this.raw.first_name;
  }

  public get lastName(): string | undefined {
    return this.raw.last_name;
  }

  public get username(): string | undefined {
    return this.raw.username;
  }

  public get languageCode(): string | undefined {
    return this.raw.language_code;
  }

  /** Whether this user is a Telegram Premium user. */
  public get isPremium(): boolean {
    return this.raw.is_premium ?? false;
  }

  /** The user's first and last name joined together. */
  public get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
  }

  /** Fetch this user's profile photos. */
  public fetchProfilePhotos(limit?: number, offset?: number) {
    return this.client.api.getUserProfilePhotos({ user_id: this.id, limit, offset });
  }

  public override toString(): string {
    return this.username ? `@${this.username}` : this.fullName;
  }
}
