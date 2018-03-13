import React from 'react';

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
						<div className = "panel-body">
	            <li>Why cannot I not see any patient information in a pending or completed session?</li>
							<blockquote>
								<h3>Patient information is stored locally to the device at the time the session is created.
								When viewing these sessions on another device, the information for the patient
								will no longer be available.</h3>
							</blockquote>
							{/*
							<li>Question 2</li>
							<blockquote>
								Answer 2
							</blockquote>
							*/}
						</div>

          </div>
        </div>
      </div>
		)
	}
}

export default Help;
