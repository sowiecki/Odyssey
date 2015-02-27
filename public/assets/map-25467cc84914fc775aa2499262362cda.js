(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/sean/dev/DDC2015/Odyssey/app/assets/javascripts/_stream_0.js":[function(require,module,exports){
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
  var RoutesSegment = require('./components').model;
  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
  var directionsService = new google.maps.DirectionsService();
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);;
  var routesPanel = _.template($('#routes-template').html());
  directionsDisplay.setMap(map);

  RoutesSegment.prototype.drawRoute = function () {
    this.makeSafeWaypts();
    var wayptsInfo = this.wayptsInfo;
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
          routesInfo: wayptsInfo
        }
        $('#routes-anchor').html(routesPanel(routesData))
        // React.render(<RoutesInfoBox />, document.getElementById('routes-anchor'))
      }
    });
  }

  function RouteControl() {
    this.getInitialTrips = function() {
      this.pauseTraverse();
      routesSegment.offset = 0
      routesSegment.bikeId = document.getElementById('bike-id-input').value;
      $.ajax({
        url: "trips_for/" + routesSegment.bikeId + "/offset_by/" + routesSegment.offset,
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
    };
    this.getNextTrip = function() {
      routesSegment.offset += 1
      $.ajax({
        url: "next_trip_for/" + routesSegment.bikeId + "/after/" + routesSegment.offset,
        method: "get",
        dataType: "json",
        success: function(data) {
          routesSegment.advanceRoute(data[0])
        }
      })
    };
    this.autoTraverseRoutes = function() {
      intervalId = setInterval(RouteControl.getNextTrip, 1000);
    };
    this.pauseTraverse = function() {
      clearInterval(intervalId);
    };
    this.noTripsFound = function() {
      // document.getElementById('error-box').toggle();
      // document.getElementById('error-box').html("No trips found!");
    }
  }

  // Initialize control dependencies
  var RouteControl = new RouteControl
  var routesSegment = new RoutesSegment
  var intervalId = null

  var BikeControl = React.createClass({displayName: "BikeControl",
    startRouting: function(e) {
      e.preventDefault();
      RouteControl.getInitialTrips();
    },
    pauseTraverse: function() {
      RouteControl.pauseTraverse();
    },
    startTraverse: function() {
      RouteControl.autoTraverseRoutes();
    },
    nextSegment: function() {
      RouteControl.getNextTrip();
    },
    render: function() {
      return (
        React.createElement("div", {id: "map-control-interface"}, 
          React.createElement("div", {className: "map-control-first-row"}, 
            React.createElement("input", {id: "bike-id-input", type: "text", autofocus: "true", placeholder: "Select a bike ID to focus on"})
          ), 
          React.createElement("div", {className: "map-control-second-row"}, 
            React.createElement("input", {id: "show-initial-routes", onClick: this.startRouting, type: "submit", value: "Follow the bike!"})
          ), 
          React.createElement("div", {className: "map-control-third-row"}, 
            React.createElement("input", {id: "pause-traverse", onClick: this.pauseTraverse, type: "submit", target: "remote", value: "▮▮"}), 
            React.createElement("input", {id: "start-traverse", onClick: this.startTraverse, type: "submit", target: "remote", value: "▶"}), 
            React.createElement("input", {id: "next-segment", onClick: this.nextSegment, type: "submit", target: "remote", value: "▶▶"})
          )
        )
      )
    }
  })
  
  // var RoutesInfoBox = React.createClass({
  //   // propTypes: {
  //   //   requiredArray: React.PropTypes.array.isRequired
  //   // },
  //   getInitialState: function() {
  //     return null;
  //   },
  //   onClick: function() {

  //   },
  //   render: function() {
  //     return (
  //       <div className="trip-box"  onClick={this.onClick}>
  //         Test
  //       </div>
  //     )
  //   }
  // })

  React.render(React.createElement(BikeControl, null), document.getElementById('bike-control-container'))
})
;

},{"./components":"/home/sean/dev/DDC2015/Odyssey/app/assets/javascripts/components.js"}],"/home/sean/dev/DDC2015/Odyssey/app/assets/javascripts/components.js":[function(require,module,exports){
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
},{}]},{},["/home/sean/dev/DDC2015/Odyssey/app/assets/javascripts/_stream_0.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfc3RyZWFtXzAuanMiLCJjb21wb25lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkKGZ1bmN0aW9uKCkge1xuICAvLyBNYXAgb3B0aW9uc1xuICB2YXIgbWFwU3R5bGUgPSBbXG4gICAge1wiZmVhdHVyZVR5cGVcIjpcImFkbWluaXN0cmF0aXZlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzQ0NDQ0NFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiNmMmYyZjJcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicG9pXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInNhdHVyYXRpb25cIjotMTAwfSx7XCJsaWdodG5lc3NcIjo1NX1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5oaWdod2F5XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcInNpbXBsaWZpZWRcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5hcnRlcmlhbFwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy5pY29uXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ0cmFuc2l0XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ3YXRlclwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzQ2YmNlY1wifSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19XG4gIF07XG4gIHZhciBtYXBPcHRpb25zID0ge1xuICAgICAgICAgIHpvb206IDExLFxuICAgICAgICAgIC8vIGRpc2FibGVEZWZhdWx0VUk6IHRydWUsXG4gICAgICAgICAgcGFuQ29udHJvbDogZmFsc2UsXG4gICAgICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgIHN0eWxlczogbWFwU3R5bGUsXG4gICAgICAgICAgY2VudGVyOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDQxLjg5MDAzMywgLTg3LjY1MDA1MjMpXG4gICAgICAgIH1cbiAgdmFyIG1hcmtlck9wdGlvbnMgPSB7XG4gICAgLy8gaWNvbjogXCJpbWFnZXMvbWFya2VyLnBuZ1wiLFxuICAgIG9wdGltaXplZDogdHJ1ZVxuICAgIC8vIHZpc2libGU6IGZhbHNlXG4gIH1cbiAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IHtcbiAgICBtYXA6IG1hcCxcbiAgICBtYXJrZXJPcHRpb25zOiBtYXJrZXJPcHRpb25zLFxuICAgIHN1cHByZXNzQmljeWNsaW5nTGF5ZXI6IHRydWVcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgTWFwIERlcGVuZGVuY2llc1xuICB2YXIgUm91dGVzU2VnbWVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cycpLm1vZGVsO1xuICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKHJlbmRlcmVyT3B0aW9ucyk7O1xuICB2YXIgZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCBtYXBPcHRpb25zKTs7XG4gIHZhciByb3V0ZXNQYW5lbCA9IF8udGVtcGxhdGUoJCgnI3JvdXRlcy10ZW1wbGF0ZScpLmh0bWwoKSk7XG4gIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuXG4gIFJvdXRlc1NlZ21lbnQucHJvdG90eXBlLmRyYXdSb3V0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1ha2VTYWZlV2F5cHRzKCk7XG4gICAgdmFyIHdheXB0c0luZm8gPSB0aGlzLndheXB0c0luZm87XG4gICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIG9yaWdpbjogdGhpcy53YXlwdHNbMF0ubG9jYXRpb24sXG4gICAgICAgIGRlc3RpbmF0aW9uOiB0aGlzLndheXB0c1t0aGlzLndheXB0cy5sZW5ndGggLSAxXS5sb2NhdGlvbixcbiAgICAgICAgd2F5cG9pbnRzOiB0aGlzLnNhZmVXYXlwdHMsXG4gICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuQklDWUNMSU5HXG4gICAgfTtcbiAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKSB7XG4gICAgICBjb25zb2xlLmxvZyhzdGF0dXMpXG4gICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcbiAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgIHZhciByb3V0ZXNEYXRhID0ge1xuICAgICAgICAgIHJvdXRlczogcmVzcG9uc2Uucm91dGVzWzBdLFxuICAgICAgICAgIHJvdXRlc0luZm86IHdheXB0c0luZm9cbiAgICAgICAgfVxuICAgICAgICAkKCcjcm91dGVzLWFuY2hvcicpLmh0bWwocm91dGVzUGFuZWwocm91dGVzRGF0YSkpXG4gICAgICAgIC8vIFJlYWN0LnJlbmRlcig8Um91dGVzSW5mb0JveCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JvdXRlcy1hbmNob3InKSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFJvdXRlQ29udHJvbCgpIHtcbiAgICB0aGlzLmdldEluaXRpYWxUcmlwcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5wYXVzZVRyYXZlcnNlKCk7XG4gICAgICByb3V0ZXNTZWdtZW50Lm9mZnNldCA9IDBcbiAgICAgIHJvdXRlc1NlZ21lbnQuYmlrZUlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jpa2UtaWQtaW5wdXQnKS52YWx1ZTtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCJ0cmlwc19mb3IvXCIgKyByb3V0ZXNTZWdtZW50LmJpa2VJZCArIFwiL29mZnNldF9ieS9cIiArIHJvdXRlc1NlZ21lbnQub2Zmc2V0LFxuICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgcm91dGVzU2VnbWVudC5idWlsZEluaXRpYWxSb3V0ZShkYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9Ucmlwc0ZvdW5kKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH07XG4gICAgdGhpcy5nZXROZXh0VHJpcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcm91dGVzU2VnbWVudC5vZmZzZXQgKz0gMVxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIm5leHRfdHJpcF9mb3IvXCIgKyByb3V0ZXNTZWdtZW50LmJpa2VJZCArIFwiL2FmdGVyL1wiICsgcm91dGVzU2VnbWVudC5vZmZzZXQsXG4gICAgICAgIG1ldGhvZDogXCJnZXRcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgcm91dGVzU2VnbWVudC5hZHZhbmNlUm91dGUoZGF0YVswXSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9O1xuICAgIHRoaXMuYXV0b1RyYXZlcnNlUm91dGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoUm91dGVDb250cm9sLmdldE5leHRUcmlwLCAxMDAwKTtcbiAgICB9O1xuICAgIHRoaXMucGF1c2VUcmF2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKTtcbiAgICB9O1xuICAgIHRoaXMubm9Ucmlwc0ZvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3ItYm94JykudG9nZ2xlKCk7XG4gICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3ItYm94JykuaHRtbChcIk5vIHRyaXBzIGZvdW5kIVwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2wgZGVwZW5kZW5jaWVzXG4gIHZhciBSb3V0ZUNvbnRyb2wgPSBuZXcgUm91dGVDb250cm9sXG4gIHZhciByb3V0ZXNTZWdtZW50ID0gbmV3IFJvdXRlc1NlZ21lbnRcbiAgdmFyIGludGVydmFsSWQgPSBudWxsXG5cbiAgdmFyIEJpa2VDb250cm9sID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkJpa2VDb250cm9sXCIsXG4gICAgc3RhcnRSb3V0aW5nOiBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBSb3V0ZUNvbnRyb2wuZ2V0SW5pdGlhbFRyaXBzKCk7XG4gICAgfSxcbiAgICBwYXVzZVRyYXZlcnNlOiBmdW5jdGlvbigpIHtcbiAgICAgIFJvdXRlQ29udHJvbC5wYXVzZVRyYXZlcnNlKCk7XG4gICAgfSxcbiAgICBzdGFydFRyYXZlcnNlOiBmdW5jdGlvbigpIHtcbiAgICAgIFJvdXRlQ29udHJvbC5hdXRvVHJhdmVyc2VSb3V0ZXMoKTtcbiAgICB9LFxuICAgIG5leHRTZWdtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgIFJvdXRlQ29udHJvbC5nZXROZXh0VHJpcCgpO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2lkOiBcIm1hcC1jb250cm9sLWludGVyZmFjZVwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1hcC1jb250cm9sLWZpcnN0LXJvd1wifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge2lkOiBcImJpa2UtaWQtaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIsIGF1dG9mb2N1czogXCJ0cnVlXCIsIHBsYWNlaG9sZGVyOiBcIlNlbGVjdCBhIGJpa2UgSUQgdG8gZm9jdXMgb25cIn0pXG4gICAgICAgICAgKSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1hcC1jb250cm9sLXNlY29uZC1yb3dcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtpZDogXCJzaG93LWluaXRpYWwtcm91dGVzXCIsIG9uQ2xpY2s6IHRoaXMuc3RhcnRSb3V0aW5nLCB0eXBlOiBcInN1Ym1pdFwiLCB2YWx1ZTogXCJGb2xsb3cgdGhlIGJpa2UhXCJ9KVxuICAgICAgICAgICksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtYXAtY29udHJvbC10aGlyZC1yb3dcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtpZDogXCJwYXVzZS10cmF2ZXJzZVwiLCBvbkNsaWNrOiB0aGlzLnBhdXNlVHJhdmVyc2UsIHR5cGU6IFwic3VibWl0XCIsIHRhcmdldDogXCJyZW1vdGVcIiwgdmFsdWU6IFwi4pau4pauXCJ9KSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge2lkOiBcInN0YXJ0LXRyYXZlcnNlXCIsIG9uQ2xpY2s6IHRoaXMuc3RhcnRUcmF2ZXJzZSwgdHlwZTogXCJzdWJtaXRcIiwgdGFyZ2V0OiBcInJlbW90ZVwiLCB2YWx1ZTogXCLilrZcIn0pLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7aWQ6IFwibmV4dC1zZWdtZW50XCIsIG9uQ2xpY2s6IHRoaXMubmV4dFNlZ21lbnQsIHR5cGU6IFwic3VibWl0XCIsIHRhcmdldDogXCJyZW1vdGVcIiwgdmFsdWU6IFwi4pa24pa2XCJ9KVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cbiAgfSlcbiAgXG4gIC8vIHZhciBSb3V0ZXNJbmZvQm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAvLyAgIC8vIHByb3BUeXBlczoge1xuICAvLyAgIC8vICAgcmVxdWlyZWRBcnJheTogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWRcbiAgLy8gICAvLyB9LFxuICAvLyAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIC8vICAgICByZXR1cm4gbnVsbDtcbiAgLy8gICB9LFxuICAvLyAgIG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuXG4gIC8vICAgfSxcbiAgLy8gICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAvLyAgICAgcmV0dXJuIChcbiAgLy8gICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLWJveFwiICBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9PlxuICAvLyAgICAgICAgIFRlc3RcbiAgLy8gICAgICAgPC9kaXY+XG4gIC8vICAgICApXG4gIC8vICAgfVxuICAvLyB9KVxuXG4gIFJlYWN0LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEJpa2VDb250cm9sLCBudWxsKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jpa2UtY29udHJvbC1jb250YWluZXInKSlcbn0pXG47XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbW9kZWw6IFJvdXRlc1NlZ21lbnRcbn07XG5cbmZ1bmN0aW9uIFJvdXRlc1NlZ21lbnQoKSB7XG4gIHRoaXMuYmlrZUlkID0gbnVsbDtcbiAgdGhpcy5vZmZzZXQgPSBudWxsO1xuICB0aGlzLndheXB0cyA9IFtdO1xuICB0aGlzLndheXB0c0luZm8gPSBbXTtcblxuICAvLyBQcmV2ZW50IE1BWF9XQVlQT0lOVFNfRVhFRURFRFxuICB0aGlzLnNhZmVXYXlwdHMgPSBbXTtcbiAgdGhpcy5tYWtlU2FmZVdheXB0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2FmZVdheXB0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy53YXlwdHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICB0aGlzLnNhZmVXYXlwdHMucHVzaChcbiAgICAgICAgdGhpcy53YXlwdHNbaV1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5idWlsZEluaXRpYWxSb3V0ZSA9IGZ1bmN0aW9uICh0cmlwcykge1xuICAgIHRoaXMud2F5cHRzLmxlbmd0aCA9IDBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLndheXB0cy5wdXNoKHtcbiAgICAgICAgbG9jYXRpb246IHRyaXBzW2ldLmxhdCArIFwiLCBcIiArIHRyaXBzW2ldLmxuZ1xuICAgICAgfSk7XG4gICAgICB0aGlzLndheXB0c0luZm8ucHVzaCh7XG4gICAgICAgIHRyaXBJZDogdHJpcHNbaV0udHJpcF9pZCxcbiAgICAgICAgc3RhcnRUaW1lOiB0cmlwc1tpXS5zdGFydF90aW1lLFxuICAgICAgICBzdG9wVGltZTogdHJpcHNbaV0uc3RvcF90aW1lXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmRyYXdSb3V0ZSgpO1xuICB9XG4gIHRoaXMuYWR2YW5jZVJvdXRlID0gZnVuY3Rpb24odHJpcCkge1xuICAgIHRoaXMud2F5cHRzLnNoaWZ0KCk7XG4gICAgdGhpcy53YXlwdHMucHVzaCh7XG4gICAgICBsb2NhdGlvbjogdHJpcC5sYXQgKyBcIiwgXCIgKyB0cmlwLmxuZ1xuICAgIH0pO1xuXG4gICAgdGhpcy53YXlwdHNJbmZvLnNoaWZ0KCk7XG4gICAgdGhpcy53YXlwdHNJbmZvLnB1c2goe1xuICAgICAgdHJpcElkOiB0cmlwLnRyaXBfaWQsXG4gICAgICBzdGFydFRpbWU6IHRyaXAuc3RhcnRfdGltZSxcbiAgICAgIHN0b3BUaW1lOiB0cmlwLnN0b3BfdGltZVxuICAgIH0pXG5cbiAgICB0aGlzLmRyYXdSb3V0ZSgpO1xuICB9XG59OyJdfQ==
