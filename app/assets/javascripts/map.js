$(function() {
  // Map options
  var mapStyle = [
    {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":55}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}
  ];
  var mapOptions = {
          zoom: 11,
          styles: mapStyle,
          center: new google.maps.LatLng(41.870033, -87.6500523)
        }
  var markerOptions = {
    icon: "images/marker.png",
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

  function RoutesSegment() {
    this.bikeId = 10;
    this.offset = 0;
    this.waypts = [];
    this.safeWaypts = [];
    this.makeSafeWaypts = function() {
      this.safeWaypts = [];
      for (var i = 1; i < 7; i++) {
        this.safeWaypts.push(
          this.waypts[i]
        );
      }
    }
    this.buildInitialRoute = function (trips) {
      for (var i = 0; i < trips.length; i++) {
        this.waypts.push({
          location: trips[i].lat + ", " + trips[i].lng,
        });
      }
      this.calcRoute();
    }
    this.advanceRoute = function(trip) {
      console.log(this.destination)
      console.log(this.safeWaypts)

      this.waypts.shift();
      this.waypts.push({
        location: trip.lat + ", " + trip.lng
      });

      this.calcRoute();
    }
    this.calcRoute = function () {
      this.makeSafeWaypts();
      var request = {
          origin: this.waypts[0].location,
          destination: this.waypts[this.waypts.length - 1].location,
          waypoints: this.safeWaypts,
          travelMode: google.maps.TravelMode.BICYCLING
      };

      directionsService.route(request, function(response, status) {
        console.log(response.routes[0])
        console.log(status)
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          var routesData = {
            routes: response.routes[0],
          }
          $('#routes-anchor').html(routesPanel(routesData))
        }

        directionsDisplay.setMap(map);
      });
    }
  }

  function getInitialTrips(bikeId, offset) {
    $.ajax({
      url: "trips_for/" + bikeId + "/offset_by/" + offset,
      method: "get",
      dataType: "json",
      success: function(data) {
        // if (data.length < 10) { endOfTheLine(); }
        routesSegment.buildInitialRoute(data);
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

  var routesSegment = new RoutesSegment
  getInitialTrips(routesSegment.bikeId, routesSegment.offset);

  function traverseRoutes() {
    routesSegment.offset += 1
    console.log(routesSegment.offset)
    getNextTrip(routesSegment.bikeId, routesSegment.offset);
  }

  function autoTraverseRoutes() {
    nIntervId = setInterval(traverseRoutes, 1000);
  }

  function pauseTraverse() {
    clearInterval(nIntervId);
  }

  function endOfTheLine() {
    $('#next-segment').fadeOut();
  }

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