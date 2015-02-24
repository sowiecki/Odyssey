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
    // icon: "images/marker.png"
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
    this.offset = 0;
    this.calcRoute = function (trips) {
      this.waypts = [];
      for (var i = 0; i < trips.length; i++) {
        routesSegment.waypts.push({
          location: trips[i].lat + ", " + trips[i].lng,
        });
      }

      var origin = routesSegment.waypts.shift().location;
      var destination = routesSegment.waypts.pop().location;

      var request = {
          origin: origin,
          destination: destination,
          waypoints: routesSegment.waypts,
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
          $('#routes-anchor').after(routesPanel(routesData))
        }

        directionsDisplay.setMap(map);
      });
    }
  }

  var routesSegment = new RoutesSegment

  // var tripHistorySegment = 1;
  function getTrips(bikeId, offset) {
    console.log(bikeId + ", " + offset)
    $.ajax({
      url: "markers/" + bikeId + "/" + offset,
      method: "get",
      dataType: "json",
      success: function(data) {
        if (data.length < 10) { endOfTheLine(); }
        routesSegment.calcRoute(data);
      }
    })
  }
  getTrips(361, routesSegment.offset);

  $('#next-segment').on('click', function(e) {
    e.preventDefault();
    routesSegment.offset += 1
    console.log(routesSegment.offset)
    getTrips(361, routesSegment.offset);
  });

  function endOfTheLine() {
    $('#next-segment').fadeOut();
  }
})