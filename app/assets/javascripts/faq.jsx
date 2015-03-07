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
          <h2>How does it work?</h2>
          <p>
            All <a href="https://www.divvybikes.com/datachallenge" target="_blank">Divvy trips made during 2014</a> are 
            loaded into this application{"'"}s database. Those trips are then cross-referenced with the 
            geo coordinates for their origin and destination stations.
          </p>
          <p>
            If you want to know more about how the maps are created and controlled using those coordinates, 
            the <a href="https://github.com/Nase00/Odyssey" target="_blank">source code can be viewed here</a>.
          </p>
          <h2>What{"'"}s the tech stack?</h2>
          <ul>
            <li>Backend: <a href="http://rubyonrails.org/" target="_blank">Ruby on Rails</a></li>
            <li>Database: <a href="http://neo4j.com/" target="_blank">Neo4j</a></li>
            <li>
              Frontend: <a href="https://developers.google.com/maps/web/" target="_blank">Google Maps API (of course!)</a> and <a href="http://facebook.github.io/react/" target="_blank">React</a>
            </li>
            <li>Other: <a href="http://facebook.github.io/react/" target="_blank">Browserify</a> and <a href="http://puma.io/" target="_blank">Puma</a></li>
          </ul>
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