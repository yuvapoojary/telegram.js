'use strict';

const fs = require('fs');
const BaseClient = require('./BaseClient');
const PollingClient = require('./PollingClient');
const WebhookClient = require('./WebhookClient');
const WorkerClient = require('./WorkerClient');
const ChatManager = require('../managers/ChatManager');
const UserManager = require('../managers/UserManager');
const ClientUser = require('../structures/ClientUser');
const CommandManager = require('../structures/CommandManager');

/**
 * The main hub for interacting with telegram Bot API
 * @extends {BaseClient}
 */
class Client extends BaseClient {
  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options = {}) {
    super(options);
    /**
     * Options of the client
     * @type {Object}
     */
    this.options = options;

    /**
     * The command manager of the client
     * @type {CommandManager}
     */
    this.commands = new CommandManager(this);

    /**
     * The worker of the client
     * @type {WorkerClient}
     */
    this.worker = new WorkerClient(this);

    /**
     * The polling client used to get updates from telegram API
     * @type {PollingClient}
     */
    this.polling = new PollingClient(this);

    /**
     * The webhook client used to get updates from telegram API
     * @type {WebhookClient}
     */
    this.webhook = new WebhookClient(this);

    /**
     * The user manager of the client
     * @type {UserManager}
     */
    this.users = new UserManager(this);
    /**
     * The chat manager of the client
     * @type {ChatManager}
     */
    this.chats = new ChatManager(this, []);

    /**
     * The token of the bot to authorize with API
     * <warn>This should be kept private always</warn>
     * @type {?string}
     */
    this.token = null;

    /**
     * The client user
     * @type {?ClientUser}
     */
    this.user = null;

    /**
     * The time at which the client was ready
     * @type {?Date}
     */
    this.readAt = null;
  }

  /**
   * The uptime of the bot/client
   * @type {?Date}
   */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
  }

  /**
   * Logs the client in and starts receiving events.
   *  @param {string} [token=this.token] Token of the bot to log in with
   *  @returns {Promise<string>} Token of the bot used
   */
  async login(token = this.token) {
    if (!token || typeof token !== 'string') throw new Error('NO TOKEN OR INVALID TOKEN PROVIDED');
    this.debug(`Provided token ${token}`);
    this.token = token;

    await this.fetchApplication();
    this.readyAt = Date.now();
    this.emit('ready');
  }

  /**
   * Start polling for the updates
   */
  startPolling() {
    this.polling.start();
  }

  /**
   * Set webhook endpoint
   * @param {string} url Public url
   * @param {BufferResolvable|Stream} [certificate] Required if you are using self signed certificate
   * @param {Object} [options] Options
   * @param {string} [options.ip_adress] Ip address of the server
   * @param {number} [options.max_connections] Max allowed simultaneous connections
   * @param {Array[]} [options.allowed_updates] Allowex updates to receive
   * @param {boolean} [options.drop_pending_updates] Wether to drop pending updates
   * @returns {Promise<boolean>}
   */
  setWebhook(url, certificate, options = {}) {
    return this.client.api.setWebhook.post({
      data: {
        url,
        ...options,
      },
      files: [
        {
          name: 'certificate',
          file: certificate,
        },
      ],
    });
  }

  /**
   * Delete webhook
   * @param {boolean} [dropUpdates=false] Drop pending updates
   * @returns {Promise<boolean>}
   */
  deleteWebhook(dropUpdates = false) {
    return this.client.api.deleteWebhook.post({
      data: {
        drop_pending_updates: dropUpdates,
      },
    });
  }

  /**
   * Set up webhook to receive updates
   * @param {string} path Path for the webhook
   * @param {number} [port=8443] Port for the webhook
   * @param {string} [host=0.0.0.0] Host for the webhook to listen on
   * @param {Object} [tlsOptions] Tls/https options for the server
   * @param {string} key Key file path
   * @param {string} cert Certificate file path
   */
  setupWebhook(path, port = 8443, host = '0.0.0.0', tlsOptions) {
    if (tlsOptions) {
      tlsOptions.key = fs.readFileSync(tlsOptions.key, 'utf8');
      tlsOptions.cert = fs.readFileSync(tlsOptions.cert, 'utf8');
    }
    this.webhook.createServer(path, port, host, tlsOptions);
  }

  /**
   * Attach existing http server for webhooks
   * @param {string} path Path for the webhook post
   * @param {http.IncomingMessage} cb
   */
  webhookCallback(path, cb) {
    this.webhook.setPath(path);
    this.webhook.callback(cb);
  }

  /**
   * Get information about the webhook
   * @returns {Promise<Object>}
   */
  getWebhookInfo() {
    return this.client.api.getWebhookInfo.get();
  }

  /**
   * Fetches the authenticated bot's information
   * @returns {Promise<ClientUser>}
   */
  fetchApplication() {
    return this.api.getMe.get().then(res => {
      this.user = new ClientUser(this, res);
      return this.user;
    });
  }

  /**
   * Get latest updates from telegram API
   * @param {Object} [options] Options
   * @returns {Promise<Object>}
   */
  getUpdates(options) {
    return this.api.getUpdates().get({
      query: options,
    });
  }

  /**
   * Log outs from the cloud Bot API
   * @returns {Promise<boolean>}
   */
  logout() {
    return this.client.logOut.post();
  }

  /**
   * Closes the bot instance
   * @returns {Promise<boolean>}
   */
  close() {
    return this.api.close.post();
  }
}

module.exports = Client;
