MapControl.Module = function() {
  var init = function() {
    var RoutingInterface = React.createClass({
      onClick: function(e) {
        e.preventDefault();
        // pauseTraverse();
        routesSegment.offset = 0
        routesSegment.bikeId = $('#bike-id-input').val()
        getInitialTrips(routesSegment.bikeId, routesSegment.offset);
      },
      render: function() {
        return (
          <div className="map-control-first-row">
            <div className="map-control-first-row">
              <input id="bike-id-input" type="text" autofocus="true" placeholder="Select a bike ID to focus on" />
            </div>
            <div className="map-control-second-row">
              <input id="show-initial-routes" onClick={this.onClick} type="submit" value="Follow the bike!" />
            </div>
          </div>
        )
      }
    })

    var NextSegment = React.createClass({
      handleClick: function() {
        routesSegment.offset += 1
        traverseRoutes();
      },
      render: function() {

      }
    })

    var PauseTraverse = React.createClass({
      handleClick: function() {
        pauseTraverse();
      },
      render: function() {

      }
    })

    var StartTraverse = React.createClass({
      handleClick: function() {
        autoTraverseRoutes();
      },
      render: function() {
        
      }
    })

    $('#pause-traverse').on('click', function(e) {
      e.preventDefault();
      pauseTraverse();
    })

    $('#start-traverse').on('click', function(e) {
      e.preventDefault();
      autoTraverseRoutes();
    })
  }
}