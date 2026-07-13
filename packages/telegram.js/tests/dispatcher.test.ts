import { describe, it, expect, vi } from 'vitest';
import { Client } from '../src/client/Client.js';
import { dispatchUpdate } from '../src/client/dispatcher.js';
import { Message } from '../src/structures/Message.js';
import { CallbackQuery } from '../src/structures/CallbackQuery.js';
import type * as T from '@telegramxjs/types';

const chat: T.Chat = { id: 10, type: 'private' };
const baseMessage: T.Message = { message_id: 1, date: 0, chat };

describe('dispatchUpdate', () => {
  it('routes a message update to the "message" event with a Message structure', () => {
    const client = new Client({ token: 'T' });
    const handler = vi.fn();
    client.on('message', handler);

    dispatchUpdate(client, { update_id: 1, message: baseMessage });

    expect(handler).toHaveBeenCalledOnce();
    const msg = handler.mock.calls[0]![0] as Message;
    expect(msg).toBeInstanceOf(Message);
    expect(msg.id).toBe(1);
    expect(msg.chat.id).toBe(10);
  });

  it('routes a callback_query update with a CallbackQuery structure', () => {
    const client = new Client({ token: 'T' });
    const handler = vi.fn();
    client.on('callbackQuery', handler);

    dispatchUpdate(client, {
      update_id: 2,
      callback_query: { id: 'cbq', from: { id: 5, is_bot: false, first_name: 'A' }, chat_instance: 'x', data: 'go' },
    });

    const query = handler.mock.calls[0]![0] as CallbackQuery;
    expect(query).toBeInstanceOf(CallbackQuery);
    expect(query.data).toBe('go');
  });

  it('always emits rawUpdate first', () => {
    const client = new Client({ token: 'T' });
    const raw = vi.fn();
    client.on('rawUpdate', raw);
    dispatchUpdate(client, { update_id: 3, edited_message: baseMessage });
    expect(raw).toHaveBeenCalledOnce();
  });

  it('routes each remaining update field to a distinct event exactly once', () => {
    const client = new Client({ token: 'T' });
    const events = {
      editedMessage: { update_id: 1, edited_message: baseMessage },
      channelPost: { update_id: 1, channel_post: baseMessage },
      poll: { update_id: 1, poll: { id: 'p' } as T.Poll },
      myChatMember: { update_id: 1, my_chat_member: {} as T.ChatMemberUpdated },
      chatJoinRequest: { update_id: 1, chat_join_request: {} as T.ChatJoinRequest },
    } satisfies Record<string, T.Update>;

    for (const [event, update] of Object.entries(events)) {
      const handler = vi.fn();
      client.on(event as 'poll', handler);
      dispatchUpdate(client, update);
      expect(handler, `event ${event}`).toHaveBeenCalledOnce();
    }
  });
});
