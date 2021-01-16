const Base = require('./Base');

/** 
 * Represents chat 
 * extends {Base}
 */
class Chat extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Message} message The message that is belongings to this chat
   */
  constructor(client, data) {
    super(client);

    this.type = data.type;
    if(data) this._patch(data);
  };

  _patch(data) {
    this.id = data.id;
  };
  
  fetch() {
    return this.client.api.getChat(this.id);
  };

};

module.exports = Chat;