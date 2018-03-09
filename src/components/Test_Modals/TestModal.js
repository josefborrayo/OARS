import React from 'react';
import firebase from 'firebase';
import moment from 'moment';
import TUG_Test_Modal from '../Test_Modals/TUG_Test_Modal'
import L_Test_Modal from '../Test_Modals/L_Test_Modal'
import PEQ_Modal from '../Test_Modals/PEQ_Modal'

/*This is the component that is the modal for each individual
test.*/

class TestModal extends React.Component {

  constructor(props) {

    super(props)

  }
  /*This function handles rendering the correct test
  on the modal depending on the selectedTest variable
  which gets set when the desired test is selected from
  the test dropdown selection. In this function,
  it is possible to change or add new tests and the
  metrics required for them.*/
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
