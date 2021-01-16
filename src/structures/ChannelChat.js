const Chat = require('./Chat');

class ChannelChat extends Chat {
   constructor(client, data) {
     super(client, data);
   };
   
   _patch(data) {
     super._patch(data);
     
     if('title' in data) {
       this.title = data.title;
     };
     
     if('username' in data) {
       this.username = data.username;
     };
     
     if('description' in data) {
       this.description = data.description;
     };
     
     if('invite_link' in data) {
       this.inviteUrl = data.invite_link;
     };
     
     if('slow_mode_delay' in data) {
       this.rateLimitPerUser = data.slow_mode_delay;
     };
     
     
   };
};

module.exports = ChannelChat;