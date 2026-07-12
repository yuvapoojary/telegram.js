import { describe, it, expect, vi, afterEach } from 'vitest';
import { METHOD_NAMES } from '@telegramxjs/types';
import { REST } from '../src/REST.js';
import { TelegramError, HTTPError } from '../src/errors.js';

function mockFetch(handler: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const spy = vi.fn(handler as unknown as typeof fetch);
  vi.stubGlobal('fetch', spy);
  return spy;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

afterEach(() => vi.unstubAllGlobals());

describe('REST', () => {
  it('sends a JSON body and returns result on success', async () => {
    const spy = mockFetch(() => jsonResponse({ ok: true, result: { message_id: 1 } }));
    const rest = new REST('T');
    const result = await rest.request('sendMessage', { chat_id: 1, text: 'hi' });

    expect(result).toEqual({ message_id: 1 });
    const [url, init] = spy.mock.calls[0]!;
    expect(url).toBe('https://api.telegram.org/botT/sendMessage');
    expect((init as RequestInit).headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect((init as RequestInit).body).toBe(JSON.stringify({ chat_id: 1, text: 'hi' }));
  });

  it('throws TelegramError with code and description on ok:false', async () => {
    mockFetch(() => jsonResponse({ ok: false, error_code: 400, description: 'Bad Request' }));
    const rest = new REST('T');
    await expect(rest.request('sendMessage', { chat_id: 1 })).rejects.toMatchObject({
      name: 'TelegramError',
      code: 400,
      message: 'Bad Request',
    });
    await expect(rest.request('sendMessage', { chat_id: 1 })).rejects.toBeInstanceOf(TelegramError);
  });

  it('retries on 429 respecting retry_after, then succeeds', async () => {
    let call = 0;
    mockFetch(() => {
      call++;
      if (call === 1) return jsonResponse({ ok: false, error_code: 429, parameters: { retry_after: 0 } });
      return jsonResponse({ ok: true, result: 'done' });
    });
    const rest = new REST('T', { maxRetries: 2 });
    const result = await rest.request('getMe');
    expect(result).toBe('done');
    expect(call).toBe(2);
  });

  it('uses multipart form-data when a file is present', async () => {
    const spy = mockFetch(() => jsonResponse({ ok: true, result: {} }));
    const rest = new REST('T');
    await rest.request('sendPhoto', { chat_id: 1, photo: Buffer.from('img') });

    const init = spy.mock.calls[0]![1] as RequestInit;
    expect(init.body).toBeInstanceOf(FormData);
    const form = init.body as FormData;
    // top-level file is referenced via attach:// and appended as a part
    expect(form.get('photo')).toBe('attach://file0');
    expect(form.get('file0')).toBeInstanceOf(Blob);
    expect(form.get('chat_id')).toBe('1');
  });

  it('wraps transport failures in HTTPError', async () => {
    mockFetch(() => {
      throw new Error('network down');
    });
    const rest = new REST('T');
    await expect(rest.request('getMe')).rejects.toBeInstanceOf(HTTPError);
  });

  it('exposes every Bot API method as a callable on the api proxy', () => {
    const rest = new REST('test-token');
    for (const name of METHOD_NAMES) {
      expect(typeof (rest.api as unknown as Record<string, unknown>)[name]).toBe('function');
    }
  });
});
