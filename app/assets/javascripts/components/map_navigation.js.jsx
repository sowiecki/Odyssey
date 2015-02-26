var RoutingInterface = React.createClass({
  startRouting: function(e) {
    e.preventDefault();
    getInitialTrips();
  },
  pauseTraverse: function() {
    pauseTraverse();
  },
  startTraverse: function() {
    autoTraverseRoutes();
  },
  nextSegment: function() {
    traverseRoutes();
  },
  render: function() {
    return (
      <div className="map-control-interface">
        <div className="map-control-first-row">
          <input id="bike-id-input" type="text" autofocus="true" placeholder="Select a bike ID to focus on" />
        </div>
        <div className="map-control-second-row">
          <input id="show-initial-routes" onClick={this.startRouting} type="submit" value="Follow the bike!" />
        </div>
        <div className="map-control-third-row">
          <input id="pause-traverse" onClick={this.pauseTraverse} type="submit" target="remote" value="&#9646;&#9646;" />
          <input id="start-traverse" onClick={this.startTraverse} type="submit" target="remote" value="&#9654;" />
          <input id="next-segment" onClick={this.nextSegment} type="submit" target="remote" value="&#9654;&#9654;" />
        </div>
      </div>
    )
  }
})

module.exports = function() {
	buildInterface: RoutingInterface
}