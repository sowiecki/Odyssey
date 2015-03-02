$(function() {
  // Map options
  var mapStyle = [
    {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":55}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}
  ];
  var mapOptions = {
    zoom: 12,
    panControl: false,
    tilt: 0,
    mapTypeControl: false,
    styles: mapStyle,
    zoomControl: false,
    center: new google.maps.LatLng(41.890033, -87.6500523)
  }
  var markerOptions = {
    icon: "assets/marker.png"
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

        React.render(<RoutesInfoContainer data={routesSegment.wayptsInfo.reverse()} />, document.getElementById('routes-display-container'))
      }
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
          routesSegment.advanceRoute(data[0]);
        }
      })
    };
    this.autoTraverseRoutes = function() {
      intervalId = setInterval(RouteControl.getTrip, 1200);
    };
    this.stopTraverse = function() {
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

  var InitializeMap = React.createClass({
    getInitialState: function() {
      return { mounted: false };
    },
    componentDidMount: function() {
      this.setState({ mounted: true });
    },
    startTraverse: function(e) {
      e.preventDefault();
      routesSegment.reset();
      routesSegment.bikeId = document.getElementById('bike-id-input').value;
      RouteControl.autoTraverseRoutes();
      React.render(<ControlMap />, document.getElementById('bike-control-container'))
    },
    startRandomTraverse: function(e) {
      e.preventDefault();
      routesSegment.reset();
      routesSegment.bikeId = Math.floor(Math.random() * (3000-1) + 1);
      RouteControl.autoTraverseRoutes();
      React.render(<ControlMap />, document.getElementById('bike-control-container'))
    },
    render: function() {
      var buttons = this.state.mounted ?
        <div id="map-control-interface">
          <div className="map-control-first-row">
            <input id="bike-id-input" type="text" autofocus="true" autoComplete="off" placeholder="Enter a bike ID" />
          </div>
          <div className="map-control-second-row">
            <input id="start-traverse" onClick={this.startTraverse} type="submit" target="remote" value="Begin" />
          </div>
          <p>- or -</p>
          <div className="map-control-second-row">
            <input id="start-traverse" onClick={this.startRandomTraverse} type="submit" target="remote" value="Follow random bike" />
          </div>
        </div> :
        <div className="map-control-second-row">
          <input id="continue-traverse" onClick={this.stopTraverse} type="submit" target="remote" value="Continue" />
        </div>;
      return (
        <div id="map-control-interface">
          <ReactCSSTransitionGroup transitionName="button" transitionAppear={true}>
            {buttons}
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  })
  var ControlMap = React.createClass({
    stopTraverse: function() {
      RouteControl.stopTraverse();
      React.render(<InitializeMap />, document.getElementById('bike-control-container'))
    },
    nextSegment: function() {
      RouteControl.getTrip();
    },
    render: function() {
      return (
        <div id="map-control-interface">
          <ReactCSSTransitionGroup transitionName="button" transitionAppear={true}>
            <div className="map-control-third-row">
              <input id="stop-traverse" onClick={this.stopTraverse} type="submit" target="remote" value="Stop" />
            </div>
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  })

  var RoutesInfoContainer = React.createClass({
    render: function() {
      var routeNodes = this.props.data.map(function (data) {
      return (
          <RouteInfoBox key={data.tripId} data={data} />
        );
      });
      return (
        <div>
          <ReactTransitionGroup transitionName="test" component={"div"}>
            {routeNodes}
          </ReactTransitionGroup>
        </div>
      );
    }
  })

  var RouteInfoBox = React.createClass({
    // componentWillEnter: function(cb) {
    //   var $element = $(this.getDOMNode());
    //   var width = 200;
    //   $element.stop(true).width(0).animate({width:width}, 2, cb);
    // },
    // componentWillLeave: function(cb) {
    //   var $el = $(this.getDOMNode());
    //   $el.stop(true).animate({width:0}, 20, cb);
    // },
    onClick: function() {
      console.log("test" + this.props.data.tripId)
    },
    render: function() {
      return (
        <div className="trip-box">
          <a href="#" onClick={this.onClick}>
            <p>Trip ID: {this.props.data.tripId}</p> 
            {this.props.data.startLocation} to {this.props.data.stopLocation}
            
          </a>
        </div>
      );
    }
  })

  React.render(<InitializeMap />, document.getElementById('bike-control-container'))
})