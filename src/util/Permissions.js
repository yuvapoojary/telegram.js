/**
 * Data structure that makes it easy to interact with a permission
 */
class Permissions {
  constructor(data = {}) {
    this.allowed = new Set();
    this.denied = new Set();
    this._patch(data);
  };

  /**
   * Data that can resolved to give a permission flag. This can be:
   * * A string (See {@link Permissions.FLAGS})
   * * A permission number
   * * A Permissions instance
   * * An array of PermissionResolvable
   * @typedef {string|number|Permissions|ermissionResolvable[]}
   */

  /**
   * Allow permissions
   * @type {PermissionResolvable}
   */
  allow(perm) {
    if (!perm) return this;
    if (perm instanceof Permissions) return this._patch(perm.toObject());
    if (typeof perm === 'string') perm = [perm];
    for (const element of perm) {
      const flag = this.resolve(perm);
      this.allowed.add(flag);
      this.denied.delete(flag);
    };
    return this;
  };

  /**
   * Deny permissions
   * @type {PermissionResolvable}
   */
  deny(perm) {
    if (!perm) return this;
    if (perm instanceof Permissions) return this._patch(perm.toObject());
    if (typeof perm === 'string') perm = [perm];
    for (const element of perm) {
      const flag = this.resolve(element);
      this.denied.add(flag);
      this.allowed.delete(flag);
    };
    return this;
  };

  /**
   *  Checks this has permissions or not
   *  @type {number|string}
   */
  has(perm) {
    const flag = this.resolve(perm);
    if (this.allowed.has(flag)) return true;
    return false;
  };

  /**
   * Checks provided flag is a valid telegram permission.
   * @param {string|number} perm A permission number or a permission flag (see {@link Permissions.FLAGS})
   */
  static isValid(perm) {
    if (Object.keys(this.constructor.FLAGS).includes(perm)) return true;
    if (Object.values(this.constructor.FLAGS)) return true;
    return false;
  };


  /**
   * Data that resolves to give permission flag
   * @param {number|string} A permission number or a permission flag (see {@link Permissions.FLAGS})
   * @returns {string} Permission flag
   */
  resolve(perm) {
    if (!Permissions.isValid(perm)) throw new Error(`Inavalid Permission Flag : ${perm}`);
    if (isNaN(perm)) return perm;
    return Object.keys(Permissions.FLAGS).find(key => this.permissions.FLAGS[key] === perm);
  };

  /**
   * Converts the permission flags to object
   */
  toObject() {
    const flags = Object.assign(...[...this.allowed].forEach(flag => ({
      [flag]: true
    })));
    Object.assign(flags, ...[...this.denied].forEach(flag => ({
      [flag]: false
    })));
    return flags;
  };

  _patch(data = {}) {
    Object.keys(this.constructor.FLAGS)
      .forEach((flag) => {
        if (data.hasOwnProperty(flag)) {
          if (data[flag] == true) return this.allowed.add(flag);
          this.denied.add(flag);
        };
      });
    return this;
  };
};

/**
 * Numeric permission flags. All available properties:
 * * `can_post_messages` (allowed tl ppst messages in channels, channels only)
 * * `can_send_messages` (allowed to send text messages, contacts, locations and venues)
 * * `can_send_media_messages` (allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages)
 * * `can_send_polls`	(allowed to send polls, implies can_send_messages)
 * *`can_send_other_messages`	(allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages)
 * * `can_add_web_page_previews` (allowed to add web page previews to their messages, implies can_send_media_messages)
 * * `can_invite_users`	(allowed to invite new users to the chat)
 * * `can_pin_messages`	(user is allowed to pin messages. Ignored in public supergroups)
 * * `can_edit_messages` (allowed to edit messages of other users and can pin messages, channels only)
 * * `can_delete_messages` (allowed to delete messages of other users)
 * * `can_restrict_members` (allowed to restrict, ban or unban chat members)
 * * `can_promote_members` (allowed to add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by him))
 * * `can_change_info` (allowed to change the chat title, photo and other settings. Ignored in public supergroups)
 * @type {Object}
 */
Permissions.FLAGS = {
  can_post_messages: 1,
  can_send_messages: 2,
  can_send_media_messages: 3,
  can_send_polls: 4,
  can_send_other_messages: 5,
  can_add_web_page_previews: 6,
  can_invite_users: 7,
  can_pin_messages: 8,
  can_edit_messages: 9,
  can_delete_messages: 10,
  can_restrict_members: 11,
  can_promote_members: 12,
  can_change_info: 13
};

module.exports = Permissions;