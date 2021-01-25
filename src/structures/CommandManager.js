'use strict';

const Base = require('./Base');
const Collection = require('../util/Collection');

/**
 * Manages Commands and triggers them when it called
 * @extends {Base}
 */
class CommandManager extends Base {
  /**
   * @param {Client} client The initiated client
   */
  constructor(client) {
    super(client);
    this.client = client;
    this.list = new Collection();
    this.prefix = '/';
    this.middleware = (cmd, msg) => msg;
  };

  /**
   * The callback function 
   * @param {Object} command - The command object
   * @param {String} command.name - The command name
   * @param {void} command.run - The function which will run 
   * @param {Message} message - The message object
   * <warn>This function must return `message` object, otherwise command will not run</warn>
   */


  /**
   * The middleware function to run before commands
   * @param {CommandMiddeware} fn Function to run
   */
  use(fn) {
    if (typeof fn !== 'function') throw new Error('Command Middleware Argument Must Be a Function');
    this.middleware = fn;
  };

  /**
   * Register command 
   * @param {String} command The command name
   * @param {Object} options The options to attach with command 
   * @param {void} fn The function to run whenever command is called
   */
  on(command, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = { aliases: [] };
    };

    if (!(options.alises instanceof Array)) options.aliases = [];

    this.list.set(command, {
      name: command,
      run: fn,
      ...options
    });
  };


  /**
   * Unregister command
   * @param {String} command The command name to delete
   */
  off(command) {
    this.list.delete(command);
  };


  /**
   * Sets prefix for the commands
   * @param {String} [prefix=/] The new prefix to set , defaults to "/".
   */
  setPrefix(prefix = '/') {
    this.prefix = prefix;
  };

  /**
   * The function which will run whenever a command message is received
   * @param {String} command The command name
   * @param {Message} message The message object
   */
  async trigger(command, message, args) {
    const cmd = this.list.get(command) || this.list.find((el) => el.aliases.includes(command));
    if (!cmd) return;
    const msg = await this.middleware(cmd, message);
    if (msg) cmd.run.call(cmd, this.client, msg, args);
  };


};

module.exports = CommandManager;