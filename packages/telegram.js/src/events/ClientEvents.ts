import type * as T from '@telegramxjs/types';
import type { Message } from '../structures/Message.js';
import type { CallbackQuery } from '../structures/CallbackQuery.js';
import type { InlineQuery } from '../structures/InlineQuery.js';
import type { ClientUser } from '../structures/ClientUser.js';

/**
 * Map of every event the {@link Client} can emit to its listener arguments. Message-like
 * updates are delivered as rich {@link Message} structures; the rest carry the raw, fully
 * typed Bot API objects (reachable and self-documenting via the generated types).
 */
export interface ClientEvents {
  /** Emitted once the client has logged in and `getMe` has resolved. */
  ready: [user: ClientUser];
  /** Emitted on any error thrown while processing an update. */
  error: [error: Error];
  /** Emitted for every raw update, before it is routed to a specific event. */
  rawUpdate: [update: T.Update];

  message: [message: Message];
  editedMessage: [message: Message];
  channelPost: [message: Message];
  editedChannelPost: [message: Message];
  businessMessage: [message: Message];
  editedBusinessMessage: [message: Message];
  guestMessage: [message: Message];

  callbackQuery: [query: CallbackQuery];
  inlineQuery: [query: InlineQuery];
  chosenInlineResult: [result: T.ChosenInlineResult];

  businessConnection: [connection: T.BusinessConnection];
  deletedBusinessMessages: [messages: T.BusinessMessagesDeleted];

  messageReaction: [reaction: T.MessageReactionUpdated];
  messageReactionCount: [reaction: T.MessageReactionCountUpdated];

  shippingQuery: [query: T.ShippingQuery];
  preCheckoutQuery: [query: T.PreCheckoutQuery];
  purchasedPaidMedia: [purchase: T.PaidMediaPurchased];

  poll: [poll: T.Poll];
  pollAnswer: [answer: T.PollAnswer];

  myChatMember: [update: T.ChatMemberUpdated];
  chatMember: [update: T.ChatMemberUpdated];
  chatJoinRequest: [request: T.ChatJoinRequest];

  chatBoost: [boost: T.ChatBoostUpdated];
  removedChatBoost: [boost: T.ChatBoostRemoved];
  managedBot: [update: T.ManagedBotUpdated];
}
