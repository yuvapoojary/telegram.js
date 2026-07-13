import type { ApiMethods } from '@telegramxjs/types';
import type { ClientEvents } from '../events/ClientEvents.js';
import { REST, type RESTOptions } from '@telegramxjs/rest';
import { TypedEmitter } from '../util/TypedEmitter.js';
import { ClientUser } from '../structures/ClientUser.js';
import { PollingClient, type PollingOptions } from './PollingClient.js';
import { WebhookClient } from './WebhookClient.js';

export interface ClientOptions {
  /** Bot token from @BotFather. May also be passed to {@link Client.login}. */
  token?: string;
  /** Options forwarded to the underlying {@link REST} transport. */
  rest?: Partial<RESTOptions>;
}

/**
 * The main entry point of the library. Wraps the {@link REST} transport, emits typed
 * events for incoming updates, and exposes the full Bot API via {@link Client.api}.
 *
 * @example
 * ```ts
 * const client = new Client();
 * client.on('message', msg => msg.reply('hi!'));
 * client.login('123:token');
 * ```
 */
export class Client extends TypedEmitter<ClientEvents> {
  public readonly rest: REST;
  /** Fully-typed access to every Bot API method. */
  public readonly api: ApiMethods;
  public readonly polling: PollingClient;
  public readonly webhook: WebhookClient;

  /** The bot's own account. `null` until {@link Client.login} resolves. */
  public user: ClientUser | null = null;
  /** When the client became ready. */
  public readyAt: Date | null = null;
  #token: string | null = null;

  public constructor(options: ClientOptions = {}) {
    super();
    this.#token = options.token ?? null;
    this.rest = new REST(this.#token ?? '', options.rest);
    this.api = this.rest.api;
    this.polling = new PollingClient(this);
    this.webhook = new WebhookClient(this);
  }

  public get token(): string | null {
    return this.#token;
  }

  /** Whether the client has completed login. */
  public get isReady(): boolean {
    return this.readyAt !== null;
  }

  /**
   * Authenticate the bot, fetch its own account via `getMe`, and emit `ready`. Does not
   * start receiving updates — call {@link Client.startPolling} or set up a webhook for that.
   */
  public async login(token = this.#token): Promise<ClientUser> {
    if (!token) throw new Error('No bot token provided. Pass one to `new Client({ token })` or `client.login(token)`.');
    this.#token = token;
    this.rest.setToken(token);

    const me = await this.api.getMe();
    this.user = new ClientUser(this, me);
    this.readyAt = new Date();
    this.emit('ready', this.user);
    return this.user;
  }

  /** Log in and immediately start long polling for updates. */
  public async startPolling(options: PollingOptions = {}): Promise<ClientUser> {
    const user = await this.login();
    await this.polling.start(options);
    return user;
  }

  /** Stop long polling, if running. */
  public stopPolling(): void {
    this.polling.stop();
  }

  /** Milliseconds since the client became ready, or `null` if not ready. */
  public get uptime(): number | null {
    return this.readyAt ? Date.now() - this.readyAt.getTime() : null;
  }
}
