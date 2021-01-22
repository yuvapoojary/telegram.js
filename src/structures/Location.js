class Location {
  constructor(data) {

    this.longitude = data.longitude;

    this.latitude = data.latitude;

    if ('heading' in data) {
      this.heading = data.heading;
    };

    if ('live_period' in data) {
      this.livePeriod = data.live_period
    };

    if ('horizontal_accuracy' in data) {
      this.horizontalAccuracy = data.horizontal_accuracy;
    };

    if ('proximity_alert_radius' in data) {
      this.proximityAlertRadius = data.proximity_alert_radius;
    };

  };

  get url() {
    return `https://www.google.com/maps/search/?api=1&query=${this.latitude},${this.longitude}`;
  };

};

module.exports = Location;