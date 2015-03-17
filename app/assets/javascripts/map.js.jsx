$(function() {
  // Map options
  var Chicago = new google.maps.LatLng(41.866867, -87.607076),
      mapStyle = [
        {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":55}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}
      ],
      mapOptions = {
        zoom: 12,
        panControl: false,
        tilt: 0,
        // disableAutoPan: true,
        mapTypeControl: false,
        styles: mapStyle,
        zoomControl: false,
        center: Chicago,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        }
      },
      markerOptions = {
        icon: "assets/marker_green.png",
        zIndex: 50
      },
      rendererOptions = {
        map: map,
        markerOptions: markerOptions,
        suppressBicyclingLayer: true,
        polylineOptions: {
          strokeColor: "#00a9ff",
          strokeOpacity: 0
        },
        preserveViewport: true
      };

  // StreetView Options
  var streetViewOptions = {
        position: Chicago,
        pov: {
          heading: 320,
          pitch: 1
        },
        addressControl: false,
        zoomControl: false,
        panControl: false
      };

  // Initialize Map Dependencies
  var RoutesSegment = require('./components').model,
      coordinates = [],
      directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions),
      directionsService = new google.maps.DirectionsService(),
      map = new google.maps.Map(document.getElementById('map'), mapOptions),
      counter = 0;

  // Initialize StreetView Dependencies
  var streetView = new google.maps.StreetViewPanorama(document.getElementById('streetview'), streetViewOptions);
  directionsDisplay.setMap(map);

  RoutesSegment.prototype.drawRoute = function () {
    this.makeSafeWaypts();
    var destination = routesSegment.waypts[routesSegment.waypts.length-1].location,
        request = {
          origin: this.waypts[0].location,
          destination: destination,
          waypoints: this.safeWaypts,
          travelMode: google.maps.TravelMode.BICYCLING
        };
    directionsService.route(request, function(response, status) {
      clearInterval(rideInterval);
      // console.log("Google response status: " + status)
      if (status == google.maps.DirectionsStatus.OK) {
        RouteControl.drawPoly(response);
        RouteControl.animate();
        directionsDisplay.setDirections(response);
        React.render(<span />, document.getElementById('error-container'));
        React.render(<RoutesInfoContainer tripsInfo={routesSegment.wayptsInfo} />, document.getElementById('routes-display-container'));
      } else {
        React.render(<ErrorContainer data={[{message: "Waiting on Google", loadAnim: true}]} />, document.getElementById('error-container'));
      };
    });
  }

  function RouteControl() {
    this.getTrip = function() {
      routesSegment.offset += 1
      $.ajax({
        url: "trip_for/" + routesSegment.bikeId + "/after/" + routesSegment.offset,
        method: "get",
        dataType: "json",
        success: function(data) {
          if (data.length) {
            routesSegment.advanceRoute(data[0]);
          } else {
            RouteControl.stopTraverse();
            React.render(<ErrorContainer data={[{message: "Bike not found, try another!", loadAnim: false}]} />, document.getElementById('error-container'));
          }
        }
      })
    },
    this.stopTraverse = function() {
      clearInterval(rideInterval);
      intervalId = 0;
      directionsDisplay.set('directions', null);
      map.panTo(Chicago);
      streetView.setPosition(Chicago);
      React.render(<span />, document.getElementById('routes-display-container'))
      React.render(<span />, document.getElementById('error-container'));
    },
    this.drawPoly = function(result) {
      var routesArray = result.routes[0].overview_path;
      poly.setMap(map);
      poly.setPath(routesArray);
    },
    this.loading = function() {
      React.render(<ErrorContainer data={[{message: "Loading trips for bike #" + routesSegment.bikeId, loadAnim: true}]} />, document.getElementById('error-container'));
    },
    this.fixate = function(location) {
      map.panTo(location);
      streetView.setPosition(location);
      var heading = google.maps.geometry.spherical.computeHeading(streetView.location.latLng, location),
          pov = streetView.getPov();
      pov.heading = heading;
      streetView.setPov(pov);
    },
    this.animate = function() {
      rideInterval = window.setInterval(function() { 
        var location = poly.getPath().getAt(counter);
        if (counter >= poly.getPath().length - 1) {
          window.clearInterval(rideInterval);
          RouteControl.getTrip();
        } else {
          interpolatePath = google.maps.geometry.spherical.interpolate(poly.getPath().getAt(counter),poly.getPath().getAt(counter + 1),counter/250);
          RouteControl.fixate(interpolatePath);
          RouteControl.fixate(location);
          counter++;
        }
      }, routesSegment.speedInterval);
    },
    this.initiate = function() {
      routesSegment.reset();
      React.render(<span />, document.getElementById('routes-display-container'));
      routesSegment.offset = 0;
      RouteControl.getTrip();
      map.setZoom(15);
      RouteControl.loading();
    };
  }

  // Initialize control dependencies
  var RouteControl = new RouteControl,
      routesSegment = new RoutesSegment,
      routeInterval,
      rideInterval,
      polyOptions = {
            path: [],
            geodesic: true,
            strokeColor: '#00a9ff',
            strokeOpacity: 0.25,
            strokeWeight: 3
          },
      poly = new google.maps.Polyline(polyOptions),
      interpolatePath;

  map.setStreetView(streetView);

  var MapControlContainer = React.createClass({
    getInitialState: function() {
      return {
        mounted: false,
        traversing: false,
        paused: false,
        speedier: false
      };
    },
    componentDidMount: function() {
      this.setState({
        mounted: true
      });
    },
    startTraverse: function() {
      routesSegment.bikeId = document.getElementById('bike-id-input').value;
      if (routesSegment.bikeId) {
        this.setState({traversing: !this.state.traversing});
        RouteControl.initiate();
      } else {
        React.render(<ErrorContainer data={[{message: "Please enter a bike id", loadAnim: false}]} />, document.getElementById('error-container'));
      }
    },
    startRandomTraverse: function() {
      this.setState({traversing: !this.state.traversing});
      routesSegment.bikeId = Math.floor(Math.random() * (3000-1) + 1);
      RouteControl.initiate();
    },
    stopTraverse: function() {
      routesSegment.reset();
      counter = 0;
      poly.setMap(null);
      clearInterval(rideInterval);
      this.setState({traversing: !this.state.traversing});
      this.setState({paused: false, speedier: false});
      RouteControl.stopTraverse();
      map.setZoom(12);
    },
    handleInterval: function() {
      this.setState({paused: !this.state.paused});
      if (!this.state.paused) {
        clearInterval(rideInterval);
        React.render(<span />, document.getElementById('error-container'));
      } else {
        RouteControl.animate();
      }
    },
    changeSpeed: function() {
      if (!this.state.paused) {
        this.setState({speedier: !this.state.speedier});

        clearInterval(rideInterval);
        if (this.state.speedier) {
          routesSegment.speedInterval = 1400;
        } else {
          routesSegment.speedInterval = 600;
        };
        RouteControl.animate();
      }
    },
    render: function() {
      var initiateButtons =
          <div key="initial-buttons" id="initial-buttons">
            <p className="click-through">{"Follow a bike"}</p>
            <input id="bike-id-input" className="map-control text-field" type="text" autofocus="true" autoComplete="off" placeholder="Enter a bike ID" />
            <input id="start-traverse" className="map-control button-green" onClick={this.startTraverse} type="submit" target="remote" value="Begin" />
            <p className="click-through">or</p>
            <input id="start-traverse" className="map-control button-green" onClick={this.startRandomTraverse} type="submit" target="remote" value="Random" />
          </div>,
        continueButton =
          <input key="continue-traverse" id="continue-traverse" className="map-control button-green" onClick={this.handleInterval} type="submit" target="remote" value="Continue" />,
        pauseButton =
          <input key="pause-traverse" id="pause-traverse" className="map-control button-blue" onClick={this.handleInterval} type="submit" target="remote" value="Pause" />,
        stopButton =
          <input key="stop-traverse" id="stop-traverse" className="map-control button-red" onClick={this.stopTraverse} type="submit" target="remote" value="Stop" />,
        currentBike =
          <span key="current-bike" id="info-left">Following bike #{routesSegment.bikeId} through 2014</span>,
        speedUp =
          <input key="speed-up" id="speed-up" className="map-control button-green" onClick={this.changeSpeed} type="submit" target="remote" value="Fast" />,
        speedDown =
          <input key="speed-down" id="speed-down" className="map-control button-blue" onClick={this.changeSpeed} type="submit" target="remote" value="Slow" />

      var buttonArray;
      var key = 0;

      if (!this.state.traversing) {
        buttonArray = [initiateButtons]
      } else if (this.state.paused) {
        buttonArray = [stopButton, continueButton, currentBike]
      } else {
        buttonArray = [stopButton, pauseButton, currentBike]
      }

      if (this.state.speedier && this.state.traversing) {
        buttonArray.push(speedDown)
      } else if (this.state.traversing) {
        buttonArray.push(speedUp)
      }

      buttonArray.map(function (button) {
        return (
            <MapControl key={key++} data={button} />
          );
      }.bind(this));

      return (
        <div>
          <ReactCSSTransitionGroup transitionName="buttons">
            <MapControl key={key++} data={buttonArray} />
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  })
  var MapControl = React.createClass({
    getInitialState: function() {
      return {
        mounted: false
      };
    },
    render: function() {
      return (
        <div id="hold-buttons">{this.props.data}</div>
      );
    }
  })

  var RoutesInfoContainer = React.createClass({
    render: function() {
      var routeNodes = this.props.tripsInfo.map(function (data) {
        return (
            <RouteInfoBox key={data.tripId} data={data} />
          );
      }.bind(this));

      return (
        <div>
          <ReactCSSTransitionGroup transitionName="routeInfoBox" component="div">
            {routeNodes}
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  })

  var RouteInfoBox = React.createClass({
    onClick: function() {
      var location = new google.maps.LatLng(this.props.data.latitude, this.props.data.longitude)
      map.panTo(location);
      RouteControl.fixate(location);
    },
    render: function() {
      return (
        <div key={this.props.data} className="trip-box">
          <a href="#" onClick={this.onClick}>
            <p><b>Origin:</b> {this.props.data.startLocation}</p>
            <span className="extended-info">
              <p className="indent">at {this.props.data.startTime}</p>
              <p><b>Destination:</b> {this.props.data.stopLocation}</p>
              <p className="indent">at {this.props.data.stopTime}</p>
              <p><b>Duration:</b> {this.props.data.duration}</p>
              <p className="trip-id">Trip ID: {this.props.data.tripId}</p> 
            </span>        
          </a>
        </div>
      );
    }
  })

  var ErrorContainer = React.createClass({
    render: function() {
      var key = 0;
      var errors = this.props.data.map(function (error) {
        return (
          <ErrorMessage key={key++} data={error} loadAnim={error.loadAnim} />
        );
      });
      return (
        <div>
          <ReactCSSTransitionGroup transitionName="error">
            {errors}
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  })
  var ErrorMessage = React.createClass({
    getInitialState: function() {
      return {dashFlash: " "};
    },
    flash: function() {
      if (this.state.dashFlash.length > 10) {
        this.setState({dashFlash: ""});
      } else {
        this.setState({dashFlash: this.state.dashFlash + "•"});
      }
    },
    componentDidMount: function() {
      if (this.props.data.loadAnim) {
        this.interval = setInterval(this.flash, 100);
      } else {
        this.interval = null;
      }
    },
    componentWillUnmount: function() {
      clearInterval(this.interval);
    },
    render: function() {
      var flash = this.props.data.loadAnim ? this.state.dashFlash : null;
      return (
        <div>{flash} {this.props.data.message} {flash}</div>
      );
    }
  })

  React.render(<MapControlContainer />, document.getElementById('bike-control-container'));
})