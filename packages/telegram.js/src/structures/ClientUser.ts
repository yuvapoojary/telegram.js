import type * as T from '@telegramxjs/types';
import type { SetMyCommandsParams } from '@telegramxjs/types';
import { User } from './User.js';

/** The bot's own user account (returned by `getMe`). */
export class ClientUser extends User {
  declare public raw: T.User;

  /** Whether the bot can be added to groups. */
  public get canJoinGroups(): boolean {
    return this.raw.can_join_groups ?? false;
  }

  /** Whether the bot can read all messages in groups (privacy mode disabled). */
  public get canReadAllGroupMessages(): boolean {
    return this.raw.can_read_all_group_messages ?? false;
  }

  /** Whether the bot supports inline queries. */
  public get supportsInlineQueries(): boolean {
    return this.raw.supports_inline_queries ?? false;
  }

  /** Set this bot's list of commands. */
  public setCommands(commands: T.BotCommand[], options: Omit<SetMyCommandsParams, 'commands'> = {}): Promise<boolean> {
    return this.client.api.setMyCommands({ commands, ...options });
  }
}
