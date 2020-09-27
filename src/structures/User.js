const Base = require('./Base');
/**
 * Represents a user on Telegram.
 * @extends {Base}
 */
 class User extends Base {
   /**
    * @param {Client} client The instantiating client
    * @param {object} data The data for the user
    */
    constructor(client, data) {
      super(client);
      /**
       * The id of the user
       * @type {integer}
       */
      this.id = data.id;
      this._patch(data);
    }
    
    _patch(data) {
      /** 
       * First name of the user
       * @type {string}
       */ 
       this.firstName = data.first_name;
       
       /** 
        * Whether the user is bot or not
        * @type {boolean}
        */
        this.bot = Boolean(data.is_bot);
        
       if('last_name' in data) {
       /**
        * Last name of the user
        * @type {?string}
        */
        this.lastName = data.lastName;
       }
       
       if('username' in data) {
         /** 
          * Username of the user
          * @type {?string}
          */
          this.username = data.username;
       }
       
       if('language_code' in data) {
         /** 
          * The language of the user
          * @type {?string}
          */ 
          this.language = data.language_code;
       }
       
       if('can_join_groups' in data) {
         /** 
          * Whether the bot can be invited by anyone or not
          * @type {?boolean}
          */
          this.invitable = Boolean(data.can_join_groups);
       }
       
       if('can_read_all_group_messages' in data) {
         /** 
          * Whether the bot is in privacy mode or not
          * @type {?boolean}
          */ 
          this.privacyEnabled = Boolean(data.can_read_all_group_messages);
       }
       
       if('supports_inline_queries' in data) {
         /** 
          * Whether the bot supports inline queries or not
          * type {?boolean}
          */ 
          this.supportsIq = Boolean(data.supports_inline_queries);
       }
       
       
    }
    
 }