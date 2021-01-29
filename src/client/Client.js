const BaseClient = require('./BaseClient');
const PollingClient = require('./PollingClient');
const WebhookClient = require('./WebhookClient');
const ClientUser = require('../structures/ClientUser');
const ChatManager = require('../managers/ChatManager');
const UserManager = require('../managers/UserManager');
const CommandManager = require('../structures/CommandManager');
const WorkerClient = require('./WorkerClient');
const fs = require('fs');

/**
 * The main hub for interacting with telegram Bot API
 * @extends {BaseClient}
 */
class Client extends BaseClient {
  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options) {
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
    this.webhook = new WebhookClient(this)

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
  };

  /**
   * Logs the client in and starts receiving events.
   *  @param {string} [token=this.token] Token of the bot to log in with
   *  @returns {Promise<string>} Token of the bot used
   */
  async login(token = this.token) {
    if (!token || typeof token != 'string') throw new Error('NO TOKEN OR INVALID TOKEN PROVIDED');
    this.debug(`Provided token ${token}`);
    this.token = token;

    await this.fetchApplication();
    this.readyAt = Date.now();
    this.emit('ready');
  };

  startPolling() {
    this.polling.start();
  };

  setWebhook(url, options = {}) {
    return this.client.api.setWebhook.post({
      data: {
        url,
        ...options
      },
      files: [{
        name: 'certificate',
        file: options.certificate
       }]
    })
  };

  deleteWebhook(dropUpdates = false) {
    return this.client.api.deleteWebhook.post({
      data: {
        drop_pending_updates: dropUpdates
      }
    });
  };

  setupWebhook(path, port = 8443, host = '0.0.0.0', tlsOptions) {
    if (tlsOptions) {
      tlsOptions.key = fs.readFileSync(tlsOptions.key, 'utf8');
      tlsOptions.cert = fs.readFileSync(tlsOptions.cert, 'utf8');
    };
    this.webhook.createServer(path, port, host, tlsOptions);
  };

  /**
   * Fetches the authenticated bot's information
   * @returns {Promise<ClientUser>}
   */
  fetchApplication() {
    return this.api.getMe.get()
      .then((res) => {
        this.user = new ClientUser(this, res);
        return this.user;
      });
  };

  /**
   * Get latest updates from telegram API
   * @returns {Promise}
   */
  getUpdates(data) {
    return this.api.getUpdates().get({
      query: data
    });
  };

  /**
   * Log outs from the cloud Bot API
   * @returns {Promise<boolean>}
   */
  logout() {
    return this.client.logOut.post()
  };

  /**
   * Closes the bot instance
   * @returns {Promise<boolean>}
   */
  close() {
    return this.api.close.post();
  };
};

module.exports = Client;