import type * as T from '@telegramxjs/types';
import type {
  SendMessageParams,
  SendPhotoParams,
  SendDocumentParams,
  SendChatActionParams,
  BanChatMemberParams,
} from '@telegramxjs/types';
import { Base } from './Base.js';
import { Message } from './Message.js';
import { ChatMember } from './ChatMember.js';

/** Options accepted by a convenience method, with the target `chat_id` filled in automatically. */
type Without<P, K extends string> = Omit<P, K | 'chat_id'>;

/** A chat: private conversation, group, supergroup, or channel. */
export class Chat extends Base<T.Chat> {
  public get id(): number {
    return this.raw.id;
  }

  public get type(): T.Chat['type'] {
    return this.raw.type;
  }

  public get title(): string | undefined {
    return this.raw.title;
  }

  public get username(): string | undefined {
    return this.raw.username;
  }

  public get firstName(): string | undefined {
    return this.raw.first_name;
  }

  public get lastName(): string | undefined {
    return this.raw.last_name;
  }

  public get isForum(): boolean {
    return this.raw.is_forum ?? false;
  }

  public get isPrivate(): boolean {
    return this.raw.type === 'private';
  }

  /** Send a text message to this chat. */
  public async send(text: string, options: Without<SendMessageParams, 'text'> = {}): Promise<Message> {
    const data = await this.client.api.sendMessage({ chat_id: this.id, text, ...options });
    return new Message(this.client, data);
  }

  /** Send a photo to this chat. */
  public async sendPhoto(
    photo: SendPhotoParams['photo'],
    options: Without<SendPhotoParams, 'photo'> = {},
  ): Promise<Message> {
    const data = await this.client.api.sendPhoto({ chat_id: this.id, photo, ...options });
    return new Message(this.client, data);
  }

  /** Send a document/file to this chat. */
  public async sendDocument(
    document: SendDocumentParams['document'],
    options: Without<SendDocumentParams, 'document'> = {},
  ): Promise<Message> {
    const data = await this.client.api.sendDocument({ chat_id: this.id, document, ...options });
    return new Message(this.client, data);
  }

  /** Tell the user that something is happening on the bot's side (e.g. "typing"). */
  public sendChatAction(action: SendChatActionParams['action'], options: Without<SendChatActionParams, 'action'> = {}) {
    return this.client.api.sendChatAction({ chat_id: this.id, action, ...options });
  }

  /** Fetch a member of this chat. */
  public async fetchMember(userId: number): Promise<ChatMember> {
    const data = await this.client.api.getChatMember({ chat_id: this.id, user_id: userId });
    return new ChatMember(this.client, data);
  }

  /** Fetch the number of members in this chat. */
  public fetchMemberCount(): Promise<number> {
    return this.client.api.getChatMemberCount({ chat_id: this.id });
  }

  /** Ban a user from this chat. */
  public banMember(userId: number, options: Without<BanChatMemberParams, 'user_id'> = {}) {
    return this.client.api.banChatMember({ chat_id: this.id, user_id: userId, ...options });
  }

  /** Unban a previously banned user. */
  public unbanMember(userId: number, onlyIfBanned = true) {
    return this.client.api.unbanChatMember({ chat_id: this.id, user_id: userId, only_if_banned: onlyIfBanned });
  }

  /** Leave this chat. */
  public leave() {
    return this.client.api.leaveChat({ chat_id: this.id });
  }

  public override toString(): string {
    return this.title ?? this.username ?? String(this.id);
  }
}
