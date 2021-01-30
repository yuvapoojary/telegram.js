'use strict';

/**
 * Represents the location structure
 */
class Location {
  constructor(data) {
    /**
     * Longitude of the location
     * @type {number}
     */
    this.longitude = data.longitude;

    /**
     * Latitude of the location
     * @type {number}
     */
    this.latitude = data.latitude;

    if ('heading' in data) {
      /**
       * The direction in which user is moving, in degrees; 1-360. For active live locations only
       * @type {?string}
       */
      this.heading = data.heading;
    }

    if ('live_period' in data) {
      /**
       * Time relative to the message
       * sending date, during which the
       * location can be updated, in
       * seconds. For active live
       * locations only
       * @type {number}
       */
      this.livePeriod = data.live_period;
    }

    /**
     * The radius of uncertainty for the
     * location, measured in meters;
     * -1500
     * @type {number}
     */
    if ('horizontal_accuracy' in data) {
      this.horizontalAccuracy = data.horizontal_accuracy;
    }

    /**
     * Maximum distance for proximity
     * alerts about approaching another
     * chat member, in meters. For sent
     * live locations only.
     * @type {number}
     */
    if ('proximity_alert_radius' in data) {
      this.proximityAlertRadius = data.proximity_alert_radius;
    }
  }

  /**
   * Get google map url for this location
   * @type {string}
   * @readonly
   */
  get url() {
    return `https://www.google.com/maps/search/?api=1&query=${this.latitude},${this.longitude}`;
  }
}

module.exports = Location;
