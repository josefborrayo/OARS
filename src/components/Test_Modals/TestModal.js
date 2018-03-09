import React from 'react';
import firebase from 'firebase';
import moment from 'moment';
import TUG_Test_Modal from '../Test_Modals/TUG_Test_Modal'
import L_Test_Modal from '../Test_Modals/L_Test_Modal'
import PEQ_Modal from '../Test_Modals/PEQ_Modal'

/*This is the component that is the modal for each individual
test.*/

class TestModal extends React.Component {

  /*Constructor for binding methods.*/
  constructor(props) {

    super(props)

    this.alertNull = this.alertNull.bind(this)

  }

  /*The state variables for this component. The title for the test,
  the time for the test, comment, and testId and selectedTest
  are common across all tests. The aidUsed variable stores whether or
  not the patient used a walking aid for the L test. The videos and text
  variable are for the video and text instructions for each text. The error
  variable stores the error message if for example a title has not been
  entered for a test. The allQuestions array stores the questions from
  PeqQuestionnaire javascript file.*/
  state = {
    title: '',
    time: '',
    aidUsed: '',
    comment: '',
    error: '',
    successMessage: '',
    testId: '',
    selectedTest: '',
    allQuestions: {},
    videos: {
      'L TEST': '//www.youtube.com/embed/gixqOS8qBNA?rel=0',
      'TUG TEST': '//www.youtube.com/embed/VljdYRXMIE8?rel=0',
      'PEQ TEST': '/images/sliderEx.gif'
    },
    text: {
      'L TEST': 'When you say "Go", begin timing using a stopwatch and instruct the patient to:\n'+
        '\t(1) Stand up from the chair.\n'+
        '\t(2) Walk 3 meters to the marker on the floor at your normal pace.\n'+
        '\t(3) Turn 90 degrees.\n'+
        '\t(4) Continue walking 7 meters.\n'+
        '\t(5) Turn 180 degrees.\n'+
        '\t(6) Return to the marker.\n'+
        '\t(7) Turn 90 degrees.\n'+
        '\t(8) Walk back to the chair at your normal pace.\n'+
        '\t(9) Sit down again.\n'+
        'Stop timing once the patient has sat down and then record the time.',

      'TUG TEST': 'When you say "Go", begin timing using a stopwatch and instruct the patient to:\n'+
        '\t(1) Stand up from the chair.\n'+
        '\t(2) Walk along the line on the floor at your normal pace.\n'+
        '\t(3) Turn 180 degrees.\n'+
        '\t(4) Walk back to the chair at your normal pace.\n'+
        '\t(5) Sit down again.\n'+
        'Stop timing once the patient has sat down and then record the time.',
      'PEQ TEST': 'This is an analog sliding scale.'
    }
  }
  /*Styles for the modal.*/
  styles = {
		row: {
			'padding': 25
    },
    metric: {
      maxHeight: 500,
      'overflow': 'scroll',
      padding: 25
    }
  };

  /*React lifecycle method: componentWillReceiveProps

  This method is invoked before a mounted component receives new props. This method
  is necessary for updating the test modal content based on which test is selected.*/
  componentWillReceiveProps (nextProps) {
    let modalTest;
    /*The tests variable defined above is limited to the scope of this block
    using the let keyword. This component is being rendered in the SessionPage_OutcomeTests
    component and a tests prop (which contains all of the tests in firebase) is passed in
    to this component.*/

    /*When this component is being rendered, new props will be passed in the form
    of the test category which would either be the TUG, L, or PEQ. The modalTest
    variable will store an array of tests from firebase if there is a next test
    that is going to be edited by clicking the edit button (nextProps.tests).*/
    if (nextProps.selectedTest && nextProps.tests) {
        modalTest = nextProps.tests[nextProps.selectedTest];
    }

    /*If tests exist in the modalTest array then the test data that corresponds to the
    specific test id of the test that is going to be edited is stored in the constant
    testData.*/
    if(modalTest) {

      const testData = modalTest[nextProps.testId];

      /*if testData exists, (there exists a test with the specificed id specificed by
      nextProps.testId) then the state variables get set to that of the corresponding
      variables and their values that exist for the test being loaded. */
      if (testData) {
        this.setState({
          title: testData.title,
          time: testData.time,
          aidUsed: testData.aidUsed,
          comment: testData.comment,
          selectedTest: testData.category,
          date: testData.date,
          successMessage: '',
          testId: nextProps.testId,
          allQuestions: testData.questions
        })
      } else {
        /*if testData does not exist then a new test is being created so set the state
        variables to null so it is an empty test as intended.*/
        if (nextProps.selectedTest) {
          this.setState({
            title: '',
            time: '',
            comment: '',
            aidUsed: '',
            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
            selectedTest: nextProps.selectedTest,
            successMessage: '',
            testId: nextProps.testId,
            allQuestions: Object.assign({}, nextProps.questions)
          })
        }
      }
    } else {
      /*If no pre-existing tests exist in the modalTest array
      then a new test is being created so set the input values
      to null to create an empty test as intended.*/
      this.setState({
        title: '',
        time: '',
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        comment: '',
        aidUsed: '',
        successMessage: '',
        selectedTest: nextProps.selectedTest,
        testId: nextProps.testId,
        allQuestions: Object.assign({}, nextProps.questions)
      })
    }
  }

  /*This function handles rendering the correct test
  on the modal depending on the selectedTest variable
  which gets set when the desired test is selected from
  the test dropdown selection. In this function,
  it is possible to change or add new tests and the
  metrics required for them.*/
  renderTest() {

    if (this.state.selectedTest === "TUG TEST") {

      return (

        <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Scale Name</th>
            <th>Value (Seconds)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Time(Seconds)</td>
            <td>
              <input
                id="textinput"
                name="textinput"
                type="text"
                placeholder='Time in Seconds'
                className="form-control input-lg"
                value={this.state.time}
                onChange={this.onInputChange.bind(this, 'time')}
              />
            </td>
          </tr>
        </tbody>
      </table>

      )


    } else if (this.state.selectedTest === "L TEST") {

      return (

        <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Scale Name</th>
            <th>Value (Seconds)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Time(Seconds)</td>
            <td>
              <input
                id="textinput"
                name="textinput"
                type="text"
                placeholder='Time in Seconds'
                className="form-control input-lg"
                value={this.state.time}
                onChange={this.onInputChange.bind(this, 'time')}
              />
            </td>
          </tr>
          <tr>
            <td>Walking aid used</td>
            <td>
              <select className="selectpicker" value={this.state.aidUsed} onChange={this.onInputChange.bind(this, 'aidUsed')}>
                <option>Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      )
      /*The questionnaire is a component so in this case
      we simply return the component and pass in the method
      to handle changes to any sliders as well as the allQuestions
      which stores the value of the slider for each question.*/
    } else if (this.state.selectedTest === "PEQ TEST") {

      return (

        <PeqQuestionnaire allQuestions={this.state.allQuestions} handlePeqSliderValueChange={this.handlePeqSliderValueChange.bind(this)} />

      )

    }

  }


  /*This is where the component is rendered.*/
	render() {
    var errors = this.state.error ? <p> {this.state.error} </p> : '';
		return (
      <div className="modal fade" id="testModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        {this.renderTest()}
      </div>
    )
	}
}

export default TestModal;
