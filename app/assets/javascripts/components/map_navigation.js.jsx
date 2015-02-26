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
}
  // console.log("init");
  // var RoutingInterface = React.createClass({
  //   onClick: function(e) {
  //     e.preventDefault();
  //     // pauseTraverse();
  //     routesSegment.offset = 0
  //     routesSegment.bikeId = $('#bike-id-input').val()
  //     getInitialTrips(routesSegment.bikeId, routesSegment.offset);
  //   },
  //   render: function() {
  //     return (
  //       <div className="map-control-first-row">
  //         <div className="map-control-first-row">
  //           <input id="bike-id-input" type="text" autofocus="true" placeholder="Select a bike ID to focus on" />
  //         </div>
  //         <div className="map-control-second-row">
  //           <input id="show-initial-routes" onClick={this.onClick} type="submit" value="Follow the bike!" />
  //         </div>
  //       </div>
  //     )
  //   }
  // })

    // var NextSegment = React.createClass({
    //   handleClick: function() {
    //     routesSegment.offset += 1
    //     traverseRoutes();
    //   },
    //   render: function() {

    //   }
    // })

    // var PauseTraverse = React.createClass({
    //   handleClick: function() {
    //     pauseTraverse();
    //   },
    //   render: function() {

    //   }
    // })

    // var StartTraverse = React.createClass({
    //   handleClick: function() {
    //     autoTraverseRoutes();
    //   },
    //   render: function() {
        
    //   }
    // })

    // $('#pause-traverse').on('click', function(e) {
    //   e.preventDefault();
    //   pauseTraverse();
    // })

    // $('#start-traverse').on('click', function(e) {
    //   e.preventDefault();
    //   autoTraverseRoutes();
    // })
