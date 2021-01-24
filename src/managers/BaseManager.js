const Collection = require('../utils/Collection');

/**
 * Base Manager which holds the caches/collections
 */
class BaseManager {
  constructor(client, iterator, holds, cacheSize) {
    Object.defineProperty(this, 'client', { value: client });

    this.cache = new Collection(cacheSize);
  };

  add(data, { id, extras: [] }) {
    const existing = this.cache.get(id || data.id);
    if (existing && existing._patch) existing._patch(data);
    if (existing) return existing;

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    this.cache.set(id || entry.id, entry);
    return entry;
  };

  remove(id) {
    return this.cache.delete(id);
  };

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
   * @returns {?Snowflake}
   */
  resolveID(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance.id;
    if (typeof idOrInstance === 'string') return idOrInstance;
    return null;
  }

  valueOf() {
    return this.cache;
  };

};

module.exports = BaseManager;