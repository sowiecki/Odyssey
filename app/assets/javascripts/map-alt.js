// $(function() {
//   var mapStyle = [
//     {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}
//   ];
//   var mapOptions = {
//         zoom: 6,
//         styles: mapStyle
//       }
//   map = new GMaps({
//     div: '#map',
//     lat: 41.850033,
//     lng: -87.6500523,
//     click: function(e){
//       console.log(e);
//     }
//   });

//   var getTrips = $.ajax({
//     url: "markers/361",
//     method: "get",
//     dataType: "json",
//   })

//   getTrips.done(function(trips) {
//     path = trips

//     map.drawPolyline({
//       path: path,
//       strokeColor: '#131540',
//       strokeOpacity: 0.6,
//       strokeWeight: 3
//     });
//   })
//   // // var iconBase = 'http://maps.google.com/mapfiles/kml/shapes/';
//   // var getTrips = $.ajax({
//   //   url: "markers/361",
//   //   method: "get",
//   //   dataType: "json",
//   // })

//   // getTrips.done(function(trips) {
//   //   var directionsDisplay;
//   //   var directionsService = new google.maps.DirectionsService();
//   //   var map;

//   //   var routesPanel = _.template(
//   //     $('#routes-template').html()
//   //   );

//   //   function initialize() {
//   //     directionsDisplay = new google.maps.DirectionsRenderer();
//   //     var chicago = new google.maps.LatLng(41.850033, -87.6500523);
//   //     var mapOptions = {
//   //       zoom: 6,
//   //       center: chicago
//   //     }
//   //     map = new google.maps.Map(document.getElementById('map'), mapOptions);
//   //     directionsDisplay.setMap(map);
//   //   }

//   //   function calcRoute(trips) {
//   //     console.log(trips[1])
//   //     trips.sort(function(a, b) {
//   //       return a.start_time - b.start_time;
//   //     });
//   //     // var start = new google.maps.LatLng(trips[0].lat, trips[0].lng);
//   //     // var end = new google.maps.LatLng(trips[trips.length - 1].lat, trips[trips.length - 1].lng);
//   //     var waypts = [];
//   //     for (var i = 0; i < trips.length; i++) {
//   //       waypts.push({
//   //           location: new google.maps.LatLng(trips[i].lat, trips[i].lng),
//   //           stopover: true
//   //         });
//   //     }
//   //     console.log(waypts)
//   //     var start = waypts[0].location
//   //     var end = waypts[waypts.length -1].location
//   //     var request = {
//   //         origin: start,
//   //         destination: end,
//   //         waypoints: waypts,
//   //         optimizeWaypoints: true,
//   //         travelMode: google.maps.TravelMode.BICYCLING
//   //     };
//   //     directionsService.route(request, function(response, status) {
//   //       if (status == google.maps.DirectionsStatus.OK) {
//   //         directionsDisplay = new google.maps.DirectionsRenderer();
//   //         directionsDisplay.setDirections(response);
//   //         var routesData = {
//   //           routes: response.routes[0],
//   //         }
//   //         console.log(response.routes[0])
//   //         $('#routes-anchor').after(routesPanel(routesData))
//   //       }
//   //       var chicago = new google.maps.LatLng(41.850033, -87.6500523);
//   //     var mapOptions = {
//   //       zoom: 6,
//   //       styles: mapStyle,
//   //       center: chicago
//   //     }
//   //     map = new google.maps.Map(document.getElementById('map'), mapOptions);
//   //     directionsDisplay.setMap(map);
//   //     });
//   //   }

//   //   calcRoute(trips);

//   //   google.maps.event.addDomListener(window, 'load', initialize);
//   // })
// })