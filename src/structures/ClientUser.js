const User = require('./User');

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

  fetch() {
    return this.client.fetchApplication();
  };


  getCommands() {
    return this.client.api.getMyCommands.get();
  };


  setCommands(commands) {
    return this.client.api.setMyCommands.post({
      data: {
        commands
      }
    });
  };


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


  async removeCommand(commandName) {
    const existing = await this.getCommands();
    const cmds = existing.filter((el) => el.command === commandName);
    if (existing.length === cmds.length) throw new Error('Command Not Found');
    return this.setCommands(cmds);
  };
  
  

};

module.exports = ClientUser;