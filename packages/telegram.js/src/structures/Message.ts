import type * as T from '@telegramxjs/types';
import type {
  SendMessageParams,
  EditMessageTextParams,
  ForwardMessageParams,
  CopyMessageParams,
} from '@telegramxjs/types';
import { Base } from './Base.js';
import { Chat } from './Chat.js';
import { User } from './User.js';

type Without<P, K extends string> = Omit<P, K | 'chat_id'>;

/** A message in a chat. */
export class Message extends Base<T.Message> {
  /** Unique message identifier inside its chat. */
  public get id(): number {
    return this.raw.message_id;
  }

  /** The chat the message belongs to. */
  public get chat(): Chat {
    return new Chat(this.client, this.raw.chat);
  }

  /** The sender, for messages sent by a user. */
  public get author(): User | undefined {
    return this.raw.from ? new User(this.client, this.raw.from) : undefined;
  }

  /** The message text, if this is a text message. */
  public get text(): string | undefined {
    return this.raw.text;
  }

  /** The caption, for media messages. */
  public get caption(): string | undefined {
    return this.raw.caption;
  }

  /** Date the message was sent, as a `Date`. */
  public get createdAt(): Date {
    return new Date(this.raw.date * 1000);
  }

  /** The message this message replies to, if any. */
  public get replyToMessage(): Message | undefined {
    return this.raw.reply_to_message ? new Message(this.client, this.raw.reply_to_message) : undefined;
  }

  /** Reply to this message in the same chat. */
  public async reply(text: string, options: Without<SendMessageParams, 'text'> = {}): Promise<Message> {
    const data = await this.client.api.sendMessage({
      chat_id: this.raw.chat.id,
      text,
      reply_parameters: { message_id: this.id },
      ...options,
    });
    return new Message(this.client, data);
  }

  /** Edit the text of this message (must be a message the bot sent). */
  public async edit(
    text: string,
    options: Without<EditMessageTextParams, 'text' | 'message_id'> = {},
  ): Promise<Message | boolean> {
    const data = await this.client.api.editMessageText({
      chat_id: this.raw.chat.id,
      message_id: this.id,
      text,
      ...options,
    });
    return typeof data === 'object' ? new Message(this.client, data) : data;
  }

  /** Delete this message. */
  public delete(): Promise<boolean> {
    return this.client.api.deleteMessage({ chat_id: this.raw.chat.id, message_id: this.id });
  }

  /** Forward this message to another chat. */
  public async forward(
    chatId: number | string,
    options: Without<ForwardMessageParams, 'from_chat_id' | 'message_id'> = {},
  ): Promise<Message> {
    const data = await this.client.api.forwardMessage({
      chat_id: chatId,
      from_chat_id: this.raw.chat.id,
      message_id: this.id,
      ...options,
    });
    return new Message(this.client, data);
  }

  /** Copy this message to another chat (sent as a new message, not a forward). */
  public copy(
    chatId: number | string,
    options: Without<CopyMessageParams, 'from_chat_id' | 'message_id'> = {},
  ): Promise<T.MessageId> {
    return this.client.api.copyMessage({
      chat_id: chatId,
      from_chat_id: this.raw.chat.id,
      message_id: this.id,
      ...options,
    });
  }

  /** Pin this message in its chat. */
  public pin(): Promise<boolean> {
    return this.client.api.pinChatMessage({ chat_id: this.raw.chat.id, message_id: this.id });
  }

  /** Unpin this message. */
  public unpin(): Promise<boolean> {
    return this.client.api.unpinChatMessage({ chat_id: this.raw.chat.id, message_id: this.id });
  }

  /** Set the bot's reaction to this message (pass a single emoji, or an array of reactions). */
  public react(reaction: string | T.ReactionType[]): Promise<boolean> {
    const normalized: T.ReactionType[] = typeof reaction === 'string' ? [{ type: 'emoji', emoji: reaction }] : reaction;
    return this.client.api.setMessageReaction({
      chat_id: this.raw.chat.id,
      message_id: this.id,
      reaction: normalized,
    });
  }
}
