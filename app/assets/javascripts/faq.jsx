$(function() {
	var Faq = React.createClass({
		getInitialState: function() {
      return {
        mounted: false,
        clicked: false
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
    render: function() {
      var faqPage =
        <div key="faq-popup" id="faq-popup">
          <p id="close"><a href="#" onClick={this.handleClick}>X</a></p>
          <h2>How do I use this?</h2>
          <p>
            Enter a bike ID (most any number from 1 to 3000) and hit Begin, or just hit "Random."
          </p>
          <p>
            <i>Odyssey</i> will then begin traversing through all of the trips taken by that particular bike during the year 2014. It will start from the first trip of the year and move chronologically forward until it reaches the last trip of the year.
          </p>
          <p>
            Up to 10 previous destinations are kept on the map at a time. Previous destinations can be clicked on to snap 
            the map and streetview back to those coordinates.
          </p>
          <h2>How does this work?</h2>
          <p>
            All <a href="https://www.divvybikes.com/datachallenge" target="_blank">Divvy trips made during 2014</a> are 
            loaded in this application{"'"}s database. Those trips are then cross-referenced with the 
            geo coordinates for their origin and destination stations.
          </p>
          <p>
            Routes are approximated for each trip using Google{"'"}s bicycling directions service. 
          </p>
          <h2>How can I find the bikes I{"'"}ve ridden?</h2>
          <p>
            If you are registered with Divvy, you can use the trip IDs from your ride history page to search for the bike you took on that trip. Click "Find your bike" in the upper-right-hand corner. If a match is found, the input field will be filled with the bike ID.
          </p>
          <h2>What{"'"}s the tech stack?</h2>
          <ul>
            <li>Backend: <a href="http://rubyonrails.org/" target="_blank">Ruby on Rails</a></li>
            <li>Database: <a href="http://neo4j.com/" target="_blank">Neo4j</a></li>
            <li>
              Frontend: <a href="https://developers.google.com/maps/web/" target="_blank">Google Maps API (of course!)</a> and <a href="http://facebook.github.io/react/" target="_blank">React</a>
            </li>
            <li>Other: <a href="http://browserify.org/" target="_blank">Browserify</a> and <a href="http://puma.io/" target="_blank">Puma</a></li>
          </ul>
          <p>
            If you want to know more about how this application works, 
            the <a href="https://github.com/Nase00/Odyssey" target="_blank">source code can be viewed here</a>.
          </p>
          <p>
            <a href="http://opensource.com/resources/what-open-source" target="_blank">Learn more about open source here</a>.
          </p>
        </div>

    	if (this.state.clicked) {
    		text = [faqPage]
    	} else { text = [null] }
      		
      var key = 0;
      text.map(function (text) {
        return (
          <FaqContainer key={key++} data={text} />
        );
      });
      return (
        <nav>
        	<a key="faq-link" href="#" onClick={this.handleClick}>FAQ</a>
          <ReactCSSTransitionGroup transitionName="faq">
            {text}
          </ReactCSSTransitionGroup>
        </nav>
      );
	  }
	});
	var FaqContainer = React.createClass({
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

	React.render(<Faq/>, document.getElementById("faq-anchor"));
});