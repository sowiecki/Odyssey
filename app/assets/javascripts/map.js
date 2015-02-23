$(function() {  
  var mapStyle = [
    {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":55}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}
  ];

  var bikeId = 361;
  var tripHistorySegment = 1;
  var getTrips = $.ajax({
    url: "markers/" + bikeId + "/" + tripHistorySegment,
    method: "get",
    dataType: "json",
  });

  getTrips.done(function(trips) {
    var markerOptions = {
      // icon: "images/marker.png"
    }

    var rendererOptions = {
      map: map,
      markerOptions: markerOptions,
      suppressBicyclingLayer: true
    }

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;

    var routesPanel = _.template(
      $('#routes-template').html()
    );

    function calcRoute(trips) {
      var waypts = [];
      for (var i = 0; i < 10; i++) {
        waypts.push({
          location: trips[i].join(),
        });
      }

      var start = waypts.shift().location
      var end = waypts.pop().location
      var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          travelMode: google.maps.TravelMode.BICYCLING
      };

      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
          directionsDisplay.setDirections(response);
          var routesData = {
            routes: response.routes[0],
          }
          $('#routes-anchor').after(routesPanel(routesData))
        }

        var chicago = new google.maps.LatLng(41.850033, -87.6500523);

        var mapOptions = {
          zoom: 6,
          styles: mapStyle,
          center: chicago
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        directionsDisplay.setMap(map);
      });
    }

    calcRoute(trips);

    // google.maps.event.addDomListener(window, 'load', initialize);
  })
})