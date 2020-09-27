const Base = require('./Base');

/**
 * Represents message
 * extends {Base}
 */ 
 
 class extends Message {
   constructor(client, data) {
     super(client);
     this._patch(data);
   }
   
   _patch(data) {
     this.id = data.message_id;
     this.createdAt = data.date;
     this.editedAt = data.edited_date ? data.edited_date : null;
     this.mentions = new Mentions(this, data.entities = []);
     
     if('from' in data) {
     this.author = new User(this.client, data.from);
     } else {
       this.author = null;
     }
     
     if('text' in data) {
       this.content = data.text;
     } else {
       this.content = null;
     }
     
     if(('forward_from_chat' in data) || ('forward_from' in data)) {
       this.isForwarded = true;
       let m = {};
       m.id = data.forward_from_message_id;
       m.from = data.forward_from;
       m.date = data.forward_date;
       m.chat = data.forward_from_chat;
       this.forwarded = new Message(this.client, m);
     } else {
       this.isForwarded = false;
     }
     
     
     
     
   }
   
   get edited() {
     return (this.editedAt ? true : false);
   }
   
   
 }