'use strict';

/** 
 * Represents the contact
 * @extends {File}
 */
class Contact {
  constructor(data = {}) {

    /**
     * Contact's phone number
     * @type {string}
     */
    this.phoneNumber = data.phone_number;

    /**
     * Contact's firstname
     * @type {string}
     */
    this.firstName = data.first_name;

    if ('last_name' in data) {
      /**
       * Contact's lastname
       * @type {?string}
       */
      this.lastName = data.last_name;
    };

    if ('user_id' in data) {
      /**
       * Contact's user identifier
       * @type {?number}
       */
      this.userId = data.user_id
    };

    if ('vcard' in data) {
      /**
       * Additional data about the data (see {@link https://en.m.wikipedia.org/wiki/VCard|vCard})
       * @type {?string}
       */
      this.vcard = data.vcard;
    };
  };
};

module.exports = Contact;