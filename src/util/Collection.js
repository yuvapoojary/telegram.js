'use strict';

const CollectionModule = require('@discordjs/collection');

/**
 * A Collection which holds a max amount of entries. The first key is deleted if the Collection has
 * reached max size.
 * @extends {Collection}
 * @param {number} [maxSize=0] The maximum size of the Collection
 * @param {Iterable} [iterable=null] Optional entries passed to the Map constructor.
 * @private
 */
class Collection extends CollectionModule {
  constructor(maxSize = Infinity, iterable = null) {
    super(iterable);
    /**
     * The max size of the Collection.
     * @type {number}
     */
    this.maxSize = maxSize;
  }

  set(key, value) {
    if (this.maxSize === 0) return this;
    if (this.size >= this.maxSize && !this.has(key)) this.delete(this.firstKey());
    return super.set(key, value);
  }

  static get[Symbol.species]() {
    return CollectionModule;
  }
}

module.exports = Collection;