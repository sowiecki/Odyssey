$(function() {
  // Map options
  var mapStyle = [
    {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":55}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}
  ];
  var mapOptions = {
          zoom: 11,
          // disableDefaultUI: true,
          panControl: false,
          mapTypeControl: false,
          styles: mapStyle,
          center: new google.maps.LatLng(41.890033, -87.6500523)
        }
  var markerOptions = {
    // icon: "images/marker.png",
    optimized: true
    // visible: false
  }
  var rendererOptions = {
    map: map,
    markerOptions: markerOptions,
    suppressBicyclingLayer: true
  }

  // Initialize Map Dependencies
  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
  var directionsService = new google.maps.DirectionsService();
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);;
  var routesPanel = _.template($('#routes-template').html());
  directionsDisplay.setMap(map);

  RoutesSegment.prototype.drawRoute = function () {
    this.makeSafeWaypts();
    var request = {
        origin: this.waypts[0].location,
        destination: this.waypts[this.waypts.length - 1].location,
        waypoints: this.safeWaypts,
        travelMode: google.maps.TravelMode.BICYCLING
    };
    directionsService.route(request, function(response, status) {
      console.log(status)
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var routesData = {
          routes: response.routes[0],
          routesInfo: routesSegment.wayptsInfo
        }
        $('#routes-anchor').html(routesPanel(routesData))
      }
      
    });
  }

  function getInitialTrips(bikeId, offset) {
    $.ajax({
      url: "trips_for/" + bikeId + "/offset_by/" + offset,
      method: "get",
      dataType: "json",
      success: function(data) {
        if (data.length) {
          routesSegment.buildInitialRoute(data);
        } else {
          noTripsFound();
        }
      }
    })
  }
  function getNextTrip(bikeId, offset) {
    $.ajax({
      url: "next_trip_for/" + bikeId + "/after/" + offset,
      method: "get",
      dataType: "json",
      success: function(data) {
        routesSegment.advanceRoute(data[0])
      }
    })
  }

  function noTripsFound() {
    document.getElementById('error-box').toggle();
    document.getElementById('error-box').html("No trips found!");
  }
  function traverseRoutes() {
    routesSegment.offset += 1
    getNextTrip(routesSegment.bikeId, routesSegment.offset);
  }
  function autoTraverseRoutes() {
    intervalId = setInterval(traverseRoutes, 1000);
  }
  function pauseTraverse() {
    clearInterval(intervalId);
  }

  // Initial control dependencies
  var routesSegment = new RoutesSegment
  var intervalId = null

  var RoutingInterface = React.createClass({
    startRouting: function(e) {
      e.preventDefault();
      // pauseTraverse();
      routesSegment.offset = 0
      routesSegment.bikeId = document.getElementById('bike-id-input').value;
      getInitialTrips(routesSegment.bikeId, routesSegment.offset);
    },
    pauseTraverse: function() {
      pauseTraverse();
    },
    startTraverse: function() {
      autoTraverseRoutes();
    },
    nextSegment: function() {
      routesSegment.offset += 1
      traverseRoutes();
    },
    render: function() {
      return (
        <div className="map-control-interface">
          <div className="map-control-first-row">
            <input id="bike-id-input" type="text" autofocus="true" placeholder="Select a bike ID to focus on" />
          </div>
          <div className="map-control-second-row">
            <input id="show-initial-routes" onClick={this.startRouting} type="submit" value="Follow the bike!" />
          </div>
          <div className="map-control-third-row">
            <input id="pause-traverse" onClick={this.pauseTraverse} type="submit" target="remote" value="&#9646;&#9646;" />
            <input id="start-traverse" onClick={this.startTraverse} type="submit" target="remote" value="&#9654;" />
            <input id="next-segment" onClick={this.nextSegment} type="submit" target="remote" value="&#9654;&#9654;" />
          </div>
        </div>
      )
    }
  })

  React.render(<RoutingInterface />, document.getElementById('map-control-container'))
})