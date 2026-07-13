import type { ApiMethods } from '@telegramxjs/types';
import { HTTPError, TelegramError } from './errors.js';
import { isUploadable, toBlob, type UploadableFile } from './files.js';
import { Readable } from 'node:stream';

export interface RESTOptions {
  /** Base URL of the Bot API server. Change this to use a local Bot API server. */
  apiRoot: string;
  /** Per-request timeout in milliseconds. */
  timeout: number;
  /** How many times to retry a request that Telegram rate-limits (HTTP 429). */
  maxRetries: number;
}

export const DEFAULT_REST_OPTIONS: RESTOptions = {
  apiRoot: 'https://api.telegram.org',
  timeout: 30_000,
  maxRetries: 3,
};

/** Extra time added on top of a long-poll window before the HTTP request is aborted. */
const LONG_POLL_BUFFER_MS = 10_000;

interface ApiResponse<T> {
  ok: boolean;
  result?: T;
  error_code?: number;
  description?: string;
  parameters?: { retry_after?: number; migrate_to_chat_id?: number };
}

/**
 * Low-level transport to the Telegram Bot API. Handles auth, JSON vs. multipart bodies,
 * file uploads (including nested `attach://` references), timeouts, and 429 retries.
 *
 * `rest.api` is a fully-typed proxy exposing every Bot API method — e.g.
 * `rest.api.sendMessage({ chat_id, text })`.
 */
export class REST {
  public readonly options: RESTOptions;
  /** Fully-typed access to every Bot API method. */
  public readonly api: ApiMethods;
  #token: string;

  public constructor(token: string, options: Partial<RESTOptions> = {}) {
    this.#token = token;
    this.options = { ...DEFAULT_REST_OPTIONS, ...options };
    this.api = this.#createApiProxy();
  }

  /** Update the bot token used for authentication. */
  public setToken(token: string): this {
    this.#token = token;
    return this;
  }

  #createApiProxy(): ApiMethods {
    return new Proxy({} as ApiMethods, {
      get: (_target, method: string) => {
        return (params?: Record<string, unknown>) => this.request(method, params);
      },
    });
  }

  /** Call a Bot API method by name with an optional params object. */
  public async request<T = unknown>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    let attempt = 0;
    for (;;) {
      const response = await this.#makeRequest<T>(method, params);
      if (response.ok) return response.result as T;

      const code = response.error_code ?? 0;
      const retryAfter = response.parameters?.retry_after;
      if (code === 429 && retryAfter != null && attempt < this.options.maxRetries) {
        attempt++;
        await sleep(retryAfter * 1000);
        continue;
      }
      throw new TelegramError(method, code, response.description ?? 'Unknown error', response.parameters);
    }
  }

  async #makeRequest<T>(method: string, params: Record<string, unknown>): Promise<ApiResponse<T>> {
    const url = `${this.options.apiRoot}/bot${this.#token}/${method}`;
    const { body, headers } = await buildBody(params ?? {});

    const timeout = this.#timeoutFor(params);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    let res: Response;
    try {
      res = await fetch(url, { method: 'POST', body, headers, signal: controller.signal });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new HTTPError(method, controller.signal.aborted ? `Request timed out after ${timeout}ms` : message);
    } finally {
      clearTimeout(timer);
    }

    let json: ApiResponse<T>;
    try {
      json = (await res.json()) as ApiResponse<T>;
    } catch {
      throw new HTTPError(method, `Failed to parse response body (HTTP ${res.status})`, res.status);
    }
    return json;
  }

  /**
   * Compute the HTTP timeout for a request. Long-poll calls (those carrying a `timeout`
   * parameter in seconds, e.g. `getUpdates`) must be allowed to run longer than the poll
   * window, so the connection isn't aborted while Telegram is holding it open. A buffer is
   * added on top of the poll window for network latency.
   */
  #timeoutFor(params: Record<string, unknown>): number {
    const longPoll = params.timeout;
    if (typeof longPoll === 'number' && longPoll > 0) {
      return Math.max(this.options.timeout, longPoll * 1000 + LONG_POLL_BUFFER_MS);
    }
    return this.options.timeout;
  }

  /**
   * Download a file previously obtained via `getFile`. Returns the raw bytes.
   * `filePath` is the `file_path` field of a Telegram `File` object.
   */
  public async download(filePath: string): Promise<Buffer> {
    const url = `${this.options.apiRoot}/file/bot${this.#token}/${filePath}`;
    const res = await fetch(url);
    if (!res.ok) throw new HTTPError('download', `Failed to download file (HTTP ${res.status})`, res.status);
    return Buffer.from(await res.arrayBuffer());
  }
}

async function buildBody(
  params: Record<string, unknown>,
): Promise<{ body: string | FormData; headers: Record<string, string> }> {
  if (!hasUploadable(params)) {
    return { body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' } };
  }

  const form = new FormData();
  const attachments: { id: string; value: Buffer | Blob | Readable | UploadableFile }[] = [];
  let counter = 0;

  const transform = (value: unknown): unknown => {
    if (isUploadable(value)) {
      const id = `file${counter++}`;
      attachments.push({ id, value });
      return `attach://${id}`;
    }
    if (Array.isArray(value)) return value.map(transform);
    if (value && typeof value === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) out[k] = transform(v);
      return out;
    }
    return value;
  };

  for (const [key, raw] of Object.entries(params)) {
    if (raw === undefined) continue;
    const value = transform(raw);
    if (typeof value === 'string') form.append(key, value);
    else if (typeof value === 'number' || typeof value === 'boolean') form.append(key, String(value));
    else form.append(key, JSON.stringify(value));
  }

  for (const { id, value } of attachments) {
    const { blob, name } = await toBlob(value);
    form.append(id, blob, name);
  }

  return { body: form, headers: {} };
}

function hasUploadable(value: unknown): boolean {
  if (isUploadable(value)) return true;
  if (Array.isArray(value)) return value.some(hasUploadable);
  if (value && typeof value === 'object') return Object.values(value).some(hasUploadable);
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
