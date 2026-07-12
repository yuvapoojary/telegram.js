import type * as T from '@telegramxjs/types';
import type { Client } from './Client.js';
import { Message } from '../structures/Message.js';
import { CallbackQuery } from '../structures/CallbackQuery.js';
import { InlineQuery } from '../structures/InlineQuery.js';

/**
 * Route a single raw {@link T.Update} to the appropriate typed client event. Emits
 * `rawUpdate` first, then exactly one specific event for the field the update carries.
 */
export function dispatchUpdate(client: Client, update: T.Update): void {
  client.emit('rawUpdate', update);

  if (update.message) return void client.emit('message', new Message(client, update.message));
  if (update.edited_message) return void client.emit('editedMessage', new Message(client, update.edited_message));
  if (update.channel_post) return void client.emit('channelPost', new Message(client, update.channel_post));
  if (update.edited_channel_post)
    return void client.emit('editedChannelPost', new Message(client, update.edited_channel_post));
  if (update.business_message) return void client.emit('businessMessage', new Message(client, update.business_message));
  if (update.edited_business_message)
    return void client.emit('editedBusinessMessage', new Message(client, update.edited_business_message));
  if (update.guest_message) return void client.emit('guestMessage', new Message(client, update.guest_message));

  if (update.callback_query) return void client.emit('callbackQuery', new CallbackQuery(client, update.callback_query));
  if (update.inline_query) return void client.emit('inlineQuery', new InlineQuery(client, update.inline_query));
  if (update.chosen_inline_result) return void client.emit('chosenInlineResult', update.chosen_inline_result);

  if (update.business_connection) return void client.emit('businessConnection', update.business_connection);
  if (update.deleted_business_messages)
    return void client.emit('deletedBusinessMessages', update.deleted_business_messages);

  if (update.message_reaction) return void client.emit('messageReaction', update.message_reaction);
  if (update.message_reaction_count) return void client.emit('messageReactionCount', update.message_reaction_count);

  if (update.shipping_query) return void client.emit('shippingQuery', update.shipping_query);
  if (update.pre_checkout_query) return void client.emit('preCheckoutQuery', update.pre_checkout_query);
  if (update.purchased_paid_media) return void client.emit('purchasedPaidMedia', update.purchased_paid_media);

  if (update.poll) return void client.emit('poll', update.poll);
  if (update.poll_answer) return void client.emit('pollAnswer', update.poll_answer);

  if (update.my_chat_member) return void client.emit('myChatMember', update.my_chat_member);
  if (update.chat_member) return void client.emit('chatMember', update.chat_member);
  if (update.chat_join_request) return void client.emit('chatJoinRequest', update.chat_join_request);

  if (update.chat_boost) return void client.emit('chatBoost', update.chat_boost);
  if (update.removed_chat_boost) return void client.emit('removedChatBoost', update.removed_chat_boost);
  if (update.managed_bot) return void client.emit('managedBot', update.managed_bot);
}
