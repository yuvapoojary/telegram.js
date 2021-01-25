'use strict';

const User = require('./User');

/**
 * Represents the ClientUser structure
 * @extends {User}
 */
class ClientUser extends User {
  constructor(client, data) {
    super(client, data);

    if ('can_join_groups' in data) {
      this.invitable = data.can_join_groups;
    };

    if ('can_read_all_group_messages' in data) {
      this.privacyMode = !data.can_read_all_group_messages;
    };

    if ('supports_inline_queries' in data) {
      this.supportsIq = data.supports_inline_queries;
    };

  };

  /**
   * Fetches the client user from API
   * @returns {Promise<ClientUser>}
   */
  fetch() {
    return this.client.fetchApplication();
  };

  /**
   * Get registered commands in telegram
   * @returns {Promise<Array<Command>>}
   */
  getCommands() {
    return this.client.api.getMyCommands.get();
  };

  /**
   * Set commands in telegram
   * @param {Array<Object>} commands
   * @returns {Promise<Boolean>}
   */
  setCommands(commands) {
    return this.client.api.setMyCommands.post({
      data: {
        commands
      }
    });
  };

  /**
   * Add command
   * @param {String} command Commad name
   * @param {String} description Command description
   * @returns {Promise<Boolean>}
   */
  async addCommand(command, description) {
    const cmds = [];

    if (command instanceof Array) {
      for (const cmd of command) {
        cmds.push({
          command: cmd.command,
          description: cmd.description
        });
      };
    } else {
      cmds.push({
        command,
        description
      });
    };

    const existing = await this.getCommands();
    return this.setCommands(existing.concat(cmds));
  };

  /**
   * Remove command
   * @param {String} command Name of the command to remove
   * @returns {Promise<Boolean>}
   */
  async removeCommand(commandName) {
    const existing = await this.getCommands();
    const cmds = existing.filter((el) => el.command === commandName);
    if (existing.length === cmds.length) throw new Error('Command Not Found');
    return this.setCommands(cmds);
  };



};

module.exports = ClientUser;