$(function() {
	var Bike = React.createClass({
		getInitialState: function() {
      return {
        mounted: false,
        clicked: false,
        bikeId: 0
      };
    },
    componentDidMount: function() {
      this.setState({
        mounted: true
      });
    },
    handleClick: function() {
    	this.setState({clicked: !this.state.clicked});
    },
    handleSearch: function() {
      var bikeId = null
      tripId = document.getElementById('trip-id-input').value;
      $.ajax({
        url: "bike_for/" + tripId,
        method: "get",
        dataType: "json",
        success: function(response) {
          bikeId = response
        }
      })
      this.setState({bikeId: bikeId});
      console.log(this.state.bikeId)
    },
    render: function() {
      var bikeSearch =
        <div key="bike-popup" id="bike-popup">
        {this.state.bikeId}
          <p id="close"><a href="#" onClick={this.handleClick}>X</a></p>
          <input id="trip-id-input" className="nav-control text-field" type="text" autofocus="true" autoComplete="off" placeholder="Trip ID" />
          <input id="trip-id-submit" className="nav-control button-green"  onClick={this.handleSearch} type="submit" value="Search" />
        </div>

    	if (this.state.clicked) {
    		text = [bikeSearch]
    	} else { text = [this.state.bikeId] }
      		
      var key = 0;
      text.map(function (text) {
        return (
          <BikeContainer key={key++} data={text} />
        );
      });
      return (
        <nav>
        	<a key="bike-link" href="#" onClick={this.handleClick}>Find your bike</a>
          <ReactCSSTransitionGroup transitionName="bike">
            {text}
          </ReactCSSTransitionGroup>
        </nav>
      );
	  }
	});
	var BikeContainer = React.createClass({
    getInitialState: function() {
      return {
        mounted: false
      };
    },
    render: function() {
      return (
        <div>{this.props.data}</div>
      );
    }
  })

	React.render(<Bike/>, document.getElementById("bike-anchor"));
});