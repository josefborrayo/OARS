import React from 'react';
import firebase from 'firebase';
import moment from 'moment';
import TUG_Test_Modal from '../Test_Modals/TUG_Test_Modal'
import L_Test_Modal from '../Test_Modals/L_Test_Modal'
import PEQ_Modal from '../Test_Modals/PEQ_Modal'

/*This is the component that renders the modal for each
test.*/

class TestModal extends React.Component {

  constructor(props) {

    super(props)

  }
  /*This function handles rendering the correct test
  on the modal depending on the selectedTest variable
  which gets set when the desired test is selected from
  the test dropdown selection in the SessionPage_OutcomeTests
  component.*/
  renderTest() {

    if (this.props.selectedTest === "TUG TEST") {

      return (

        <TUG_Test_Modal
          selectedTest={this.props.selectedTest}
          sessionId={this.props.sessionId}
          rememberValues={this.props.rememberValues.bind(this)}
          questions={this.props.questions}
          tests={this.props.tests}
          testId={this.props.testId}
        />

      )


    } else if (this.props.selectedTest === "L TEST") {


      return (


        <L_Test_Modal
          selectedTest={this.props.selectedTest}
          sessionId={this.props.sessionId}
          rememberValues={this.props.rememberValues.bind(this)}
          tests={this.props.tests}
          testId={this.props.testId}
        />
      )

    } else if (this.props.selectedTest === "PEQ TEST") {

      return (

        <PEQ_Modal
          questions={this.props.questions}
          selectedTest={this.props.selectedTest}
          sessionId={this.props.sessionId}
          rememberValues={this.props.rememberValues.bind(this)}
          tests={this.props.tests}
          testId={this.props.testId}
        />

      )

    }

  }


  /*This is where the component is rendered.*/
	render() {

		return (
      <div className="modal fade" id="testModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        {this.renderTest()}
      </div>
    )
	}
}

export default TestModal;
