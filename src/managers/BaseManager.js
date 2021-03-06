'use strict';

const Collection = require('../util/Collection');
/**
 * Base Manager which holds the caches/collections
 */
class BaseManager {
  constructor(client, iterable, holds, cacheSize) {
    /**
     * The instantiated client
     * @type {Client}
     * @name BaseManager#client
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The data structure belonging to this manager
     * @name BaseManager#holds
     * @type {Function}
     * @readonly
     * @private
     */
    Object.defineProperty(this, 'holds', { value: holds });

    this.cache = new Collection(cacheSize);
  }

  add(data, { id, extras = [] } = {}) {
    const existing = this.cache.get(id || data.id);
    if (existing && existing._patch) existing._patch(data);
    if (existing) return existing;

    if (data instanceof this.holds) {
      this.cache.set(data.id, data);
      return data;
    }

    const entry = new this.holds(this.client, data, ...extras);
    this.cache.set(id || entry.id, entry);
    return entry;
  }

  remove(id) {
    return this.cache.delete(id);
  }

  /**
   * Resolves a data entry to a data Object.
   * @param {string|Object} idOrInstance The id or instance of something in this Manager
   * @returns {?Object} An instance from this Manager
   */
  resolve(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance;
    if (typeof idOrInstance === 'string') return this.cache.get(idOrInstance) || null;
    return null;
  }

  /**
   * Resolves a data entry to a instance ID.
   * @param {string|Object} idOrInstance The id or instance of something in this Manager
   * @returns {number|string}
   */
  resolveID(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance.id;
    if (typeof idOrInstance === 'string') return idOrInstance;
    return null;
  }

  valueOf() {
    return this.cache;
  }
}

module.exports = BaseManager;
