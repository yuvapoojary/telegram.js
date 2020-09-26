const BaseClient = require('./BaseClient');

/**
 * The main hub for interacting with telegram API
 * @extends {BaseClient}
 */
 class Client extends BaseClient {
   /**
    * @param {ClientOptions} [options] Options for the client
    */
   constructor(options) {
     /**
      * Options of the client
      * @type {Object} 
      */
     this.options = options;
     
     /**
      * The polling client used to get updates from telegram API
      * @type {PollingClient}
      */
      this.polling = new PollingClient(this);
      
     /**
      * The webhook client used to get updates from telegram API
      * @type {WebhookClient}
      */
      this.webhook = new WebhookClient(this);
      
      /**
       * The action manager of the client
       * @type {ActionManager}
       * @private
       */
       this.actions = new ActionManager(this);
       
       /**
        * The token of the bot to authorize with API
        * <warn>This should be kept private always</warn>
        * @type {?string}
        */
        this.token = null;
        
        /**
         * The time at which the client was ready 
         * @type {?Date}
         */
         this.readAt = null;
         
   }
         
          /**
          * The uptime of the bot/client
          * @type {?Date}
          */
          get uptime() {
            return this.readyAt ? Date.now() - this.readyAt : null;
          };
          
          /**
           * Logs the client in and starts receiving events.
           *  @param {string} [token=this.token] Token of the bot to log in with
           * returns {Promise<string>} Token of the bot used
           */
           async login(token = this.token) {
             if(!token || typeof token != 'string') throw new Error('NO TOKEN OR INVALID TOKEN PROVIDED');
             this.debug(`Provided token ${token}`);
             try {
               await this.trackUpdates();
             } catch(err) {
               
             };
             
           }
           
           /**
            * Track telegram updates either through polling or webhooks 
            * 
            */
          
          
   
 }
 
 module.exports = Client;