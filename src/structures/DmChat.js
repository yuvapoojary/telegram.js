const Chat = require('./Chat');

class DmChat extends Channel {
  constructor(client, data) {
    super(client, data);
   
  };
  
  _patch(data) {
    super._patch(data);
    
    this.firstName = data.first_name || null;
    
    this.last_name = data.last_name || null;
    
    this.username = data.username || null;
    
    if('bio' in data) {
      this.bio = data.bio;
    };
   
  };
  
};

module.exports = DmChat;