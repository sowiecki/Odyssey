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
    this.drawRoute = function () {
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
    $('#error-box').html("No trips found!")
  }

  function traverseRoutes() {
    routesSegment.offset += 1
    getNextTrip(routesSegment.bikeId, routesSegment.offset);
  }

  function autoTraverseRoutes() {
    nIntervId = setInterval(traverseRoutes, 1000);
  }

  function pauseTraverse() {
    clearInterval(nIntervId);
  }

  // Initial control dependencies
  var routesSegment = new RoutesSegment
  var nIntervId = null

  $('#show-initial-routes').on('click', function(e) {
    e.preventDefault();
    pauseTraverse();
    routesSegment.offset = 0
    routesSegment.bikeId = $('#bike-id-input').val()
    getInitialTrips(routesSegment.bikeId, routesSegment.offset);
  })

  $('#next-segment').on('click', function(e) {
    e.preventDefault();
    routesSegment.offset += 1
    traverseRoutes();
  });

  $('#pause-traverse').on('click', function(e) {
    e.preventDefault();
    pauseTraverse();
  })

  $('#start-traverse').on('click', function(e) {
    e.preventDefault();
    autoTraverseRoutes();
  })
})