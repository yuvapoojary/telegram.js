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
    super(client, data);
    
    this.client = client;
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

      /**
       * Last name of the user
       * @type {?string}
       */
      this.lastName = data.lastName || null;
    

      /** 
       * Username of the user
       * @type {?string}
       */
      this.username = data.username || null;
   

   
      /** 
       * The language of the user
       * @type {?string}
       */
      this.language = data.languageCode || null;
    

  }
  
  getPhotos(offset = 0, limit = 100) {
     return this.client.api.getPhotos().get({
       data: {
         user_id: this.id,
         limit,
         offset
       }
     });
  };

};

module.exports = User;