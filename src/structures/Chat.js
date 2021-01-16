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
    super(client, data);
    this.client = client;
    this.type = data.type;
    if(data) this._patch(data);
  };

  _patch(data) {
    this.id = data.id;
  };
  
  fetch() {
    return this.client.api.getChat(this.id);
  };
  
  send(content, options = {}) {
    const Msg = require('./Message');
    return this.client.api.sendMessage.post({
      data: {
        chat_id: this.id,
        text: content,
        ...options
      }
    })
    .then((data) => new (require('./Message'))(this.client, data));
  };
  
};

module.exports = Chat;