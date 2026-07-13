import type { IncomingMessage, ServerResponse, Server } from 'node:http';
import { createServer } from 'node:http';
import type { Client } from './Client.js';
import type * as T from '@telegramxjs/types';
import { dispatchUpdate } from './dispatcher.js';

export interface WebhookServerOptions {
  /** Path the webhook is served on. Requests to other paths get a 404. Defaults to `/`. */
  path?: string;
  /** Optional secret token; if set, requests must carry a matching `X-Telegram-Bot-Api-Secret-Token`. */
  secretToken?: string;
}

/** Receives updates from Telegram via webhook (incoming HTTP POST requests). */
export class WebhookClient {
  public constructor(public readonly client: Client) {}

  /** Feed a single raw update (already parsed) into the client's dispatcher. */
  public handleUpdate(update: T.Update): void {
    try {
      dispatchUpdate(this.client, update);
    } catch (err) {
      this.client.emit('error', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Build a Node `http` request handler suitable for mounting on an existing server or
   * passing to {@link WebhookClient.createServer}.
   */
  public callback(options: WebhookServerOptions = {}): (req: IncomingMessage, res: ServerResponse) => void {
    const path = options.path ?? '/';
    return (req, res) => {
      if (req.method !== 'POST' || (req.url ?? '/').split('?')[0] !== path) {
        res.statusCode = 404;
        res.end();
        return;
      }
      if (options.secretToken && req.headers['x-telegram-bot-api-secret-token'] !== options.secretToken) {
        res.statusCode = 401;
        res.end();
        return;
      }

      const chunks: Buffer[] = [];
      req.on('data', chunk => chunks.push(chunk as Buffer));
      req.on('end', () => {
        try {
          const update = JSON.parse(Buffer.concat(chunks).toString('utf8')) as T.Update;
          this.handleUpdate(update);
          res.statusCode = 200;
          res.end();
        } catch (err) {
          this.client.emit('error', err instanceof Error ? err : new Error(String(err)));
          res.statusCode = 400;
          res.end();
        }
      });
    };
  }

  /** Register the webhook with Telegram and start a built-in HTTP server to receive updates. */
  public async createServer(url: string, port: number, options: WebhookServerOptions = {}): Promise<Server> {
    await this.client.api.setWebhook({ url, secret_token: options.secretToken });
    const server = createServer(this.callback(options));
    await new Promise<void>(resolve => server.listen(port, resolve));
    return server;
  }
}
