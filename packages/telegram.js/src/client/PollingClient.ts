import type { Client } from './Client.js';
import type { GetUpdatesParams } from '@telegramxjs/types';
import { dispatchUpdate } from './dispatcher.js';

export interface PollingOptions {
  /** Long-poll timeout in seconds passed to `getUpdates`. Defaults to 30. */
  timeout?: number;
  /** Maximum number of updates to fetch per call (1-100). */
  limit?: number;
  /** Update types to receive. Omit to receive all except `chat_member`. */
  allowedUpdates?: GetUpdatesParams['allowed_updates'];
  /** Identifier of the first update to fetch. */
  offset?: number;
}

/** Receives updates from Telegram via long polling (`getUpdates`). */
export class PollingClient {
  public running = false;
  #offset = 0;

  public constructor(public readonly client: Client) {}

  /** Begin the polling loop. Resolves once polling has started. */
  public async start(options: PollingOptions = {}): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.#offset = options.offset ?? 0;
    const timeout = options.timeout ?? 30;
    void this.#loop(options, timeout);
  }

  /** Stop the polling loop. */
  public stop(): void {
    this.running = false;
  }

  async #loop(options: PollingOptions, timeout: number): Promise<void> {
    let backoff = 0;
    while (this.running) {
      try {
        const updates = await this.client.api.getUpdates({
          offset: this.#offset,
          timeout,
          limit: options.limit,
          allowed_updates: options.allowedUpdates,
        });
        backoff = 0;
        for (const update of updates) {
          this.#offset = update.update_id + 1;
          try {
            dispatchUpdate(this.client, update);
          } catch (err) {
            this.client.emit('error', err instanceof Error ? err : new Error(String(err)));
          }
        }
      } catch (err) {
        this.client.emit('error', err instanceof Error ? err : new Error(String(err)));
        backoff = Math.min(backoff === 0 ? 1000 : backoff * 2, 30_000);
        await sleep(backoff);
      }
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
