$(function() {
  var mapStyle = [
    {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}
  ];
  // var iconBase = 'http://maps.google.com/mapfiles/kml/shapes/';
  var getTrips = $.ajax({
    url: "markers/361",
    method: "get",
    dataType: "json",
  })

  getTrips.done(function(trips) {
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;

    function initialize() {
      directionsDisplay = new google.maps.DirectionsRenderer();
      var chicago = new google.maps.LatLng(41.850033, -87.6500523);
      var mapOptions = {
        zoom: 6,
        center: chicago
      }
      map = new google.maps.Map(document.getElementById('map'), mapOptions);
      directionsDisplay.setMap(map);
    }

    function calcRoute(trips) {
      var start = new google.maps.LatLng(trips[1].lat, trips[1].lng);
      var end = new google.maps.LatLng(trips[trips.length - 1].lat, trips[trips.length - 1].lng);
      var waypts = trips.reduce(function(a, waypoint) {
        var lastpoint = trips[trips.length - 1];
        if( !lastpoint || !waypoint.equals(lastpoint.location) ) {
            trips.push({ location:waypoint, stopover:true });
        }
        return trips;
      }, []);
      // var waypts = [];
      // for (var i = 0; i < trips.length; i++) {
      //   waypts.push({
      //       location: new google.maps.LatLng(trips[2].lat, trips[2].lng),
      //       stopover: true
      //     });
      // }
      // console.log(start.toString().replace(/\s+/g, ''))
      var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.BICYCLING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          console.log(response)
          directionsDisplay.setDirections(response);
          // var route = response.routes[0];
          // var summaryPanel = document.getElementById('directions_panel');
          // summaryPanel.innerHTML = '';
          // // For each route, display summary information.
          // for (var i = 0; i < route.legs.length; i++) {
          //   var routeSegment = i + 1;
          //   summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
          //   summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          //   summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          //   summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
          // }
        }
      });
    }

    calcRoute(trips);

    google.maps.event.addDomListener(window, 'load', initialize);

    // handler = Gmaps.build('Google');
    // handler.buildMap({
    //   provider: {
    //     styles: mapStyle,
    //     icon: iconBase + 'schools_maps.png'
    //   }, internal: {id: 'map'}}, function(){

    //     markers = handler.addMarkers(trips);
    //     handler.bounds.extendWith(markers);
    //     handler.fitMapToBounds();
    //   });

    // console.log(trips[1])

    // var directionsDisplay = new google.maps.DirectionsRenderer();
    // var directionsService = new google.maps.DirectionsService();

    // function calcRoute() {
    //   var origin      = new google.maps.LatLng(trips[0].lat, trips[0].lng);
    //   var destination = new google.maps.LatLng(trips[1].lat, trips[1].lng);
    //   var request = {
    //       origin:      origin,
    //       destination: destination,
    //       travelMode:  google.maps.TravelMode.BICYCLING
    //   };
    //   directionsService.route(request, function(response, status) {
    //     if (status == google.maps.DirectionsStatus.OK) {
    //       directionsDisplay.setDirections(response);
    //     }
    //   });
    // }

    // calcRoute();

    // var handler = Gmaps.build('Google');
    // handler.buildMap({
    //   provider: {
    //     styles: mapStyle,
    //     icon: iconBase + 'schools_maps.png'
    //   },
    //   internal: {id: 'map'}}, function(){
    //   directionsDisplay.setMap(handler.getMap());
    // });
  })
})