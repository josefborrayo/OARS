import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

/*This Help page contains Frequently Asked Questions*/

class Help extends React.Component {

	/*This is where the component is rendered.*/
	render() {

		return (
      <div id="wrapper" className="container">
        <div className="dashWidth">
          <div className="panel panel-default col-lg panel-info">
            <div className="panel-heading text-center">
              <h3 className = "dash">Frequently Asked Questions</h3>
            </div>

            <li>Question 1</li>
						<blockquote>Answer 1</blockquote>

						<li>Question 2</li>
						<blockquote>Answer 2</blockquote>

          </div>
        </div>
      </div>
		)
	}
}

export default Help;
