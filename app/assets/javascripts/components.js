module.exports = {
  model: RoutesSegment
};

function RoutesSegment() {
  this.bikeId = null;
  this.offset = null;
  this.waypts = [];
  this.wayptsInfo = [];

  // Prevent MAX_WAYPOINTS_EXEEDED
  this.safeWaypts = [];
  this.makeSafeWaypts = function() {
    this.safeWaypts = [];
    for (var i = 1; i < this.waypts.length - 1; i++) {
      this.safeWaypts.push(
        this.waypts[i]
      );
    }
  }

  this.buildInitialRoute = function (trips) {
    this.waypts.length = 0
    for (var i = 0; i < trips.length; i++) {
      this.waypts.push({
        location: trips[i].lat + ", " + trips[i].lng
      });
      this.wayptsInfo.push({
        tripId: trips[i].trip_id,
        startTime: trips[i].start_time,
        stopTime: trips[i].stop_time
      })
    }
    this.drawRoute();
  }
  this.advanceRoute = function(trip) {
    this.waypts.shift();
    this.waypts.push({
      location: trip.lat + ", " + trip.lng
    });

    this.wayptsInfo.shift();
    this.wayptsInfo.push({
      tripId: trip.trip_id,
      startTime: trip.start_time,
      stopTime: trip.stop_time
    })

    this.drawRoute();
  }
};