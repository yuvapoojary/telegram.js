const Base = require ('./Base');
const { ChatTypes } = require('../util/Util');

/** 
 * Represents chat 
 * extends {Base}
 */ 
 class Chat extends Base { 
   /**
    * @param {Client} client The instantiating client
    * @param {Message} message The message that is belongings to this chat
    */
   constructor(client, message) {
     super(client);
     /**
      * The id of the chat
      * @type {integer}
      */
      this.id = message.chat.id;
      
   }
   
   get type() {
     return ChatTypes(message.chat.type);
   }
   
 }