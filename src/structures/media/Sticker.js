'use strict';

const File = require('./File');
const Photo = require('./Photo');

class Sticker extends File {
  constructor(data = {}) {
    super(data);

    this.width = data.width;

    this.height = data.height;

    this.isAnimated = data.is_animated;

    if ('thumb' in data) {
      this.thumbnail = new Photo(data.thumb);
    };

    if ('emoji' in data) {
      this.emoji = data.emoji;
    };

    if ('set_name' in data) {
      this.setName = data.set_name;
    };

    if ('mask_position' in data) {
      this.maskPosition = data.mask_position;
    };
  };
  
};

module.exports = Sticker;