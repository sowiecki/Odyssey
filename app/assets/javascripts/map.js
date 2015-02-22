var mapStyle = [
  {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}
];
var iconBase = 'http://maps.google.com/mapfiles/kml/shapes/';
var getTrips = $.ajax({
  url: "markers/361",
  method: "get",
  dataType: "json",
})

getTrips.done(function(trips) {
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

  console.log(trips[1])

  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();

  function calcRoute() {
    var origin      = new google.maps.LatLng(trips[0].lat, trips[0].lng);
    var destination = new google.maps.LatLng(trips[1].lat, trips[1].lng);
    var request = {
        origin:      origin,
        destination: destination,
        travelMode:  google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }

  calcRoute();

  var handler = Gmaps.build('Google');
  handler.buildMap({
    provider: {
      styles: mapStyle,
      icon: iconBase + 'schools_maps.png'
    },
    internal: {id: 'map'}}, function(){
    directionsDisplay.setMap(handler.getMap());
  });
})