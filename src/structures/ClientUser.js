const User = require('./User');

class ClientUser extends User {
  constructor(client, data) {
    super(client, data);

    if ('can_join_groups' in data) {
      this.invitable = data.can_join_groups;
    };

    if ('can_read_all_group_messages' in data) {
      this.privacyMode = data.can_read_all_group_messages;
    };

    if ('supports_inline_queries' in data) {
      this.supportsIq = data.supports_inline_queries;
    };

  };

  fetch() {
    return this.client.fetchApplication();
  };

};

module.exports = ClientUser;