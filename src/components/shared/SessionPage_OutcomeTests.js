import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import SweetAlert from 'react-bootstrap-sweetalert';
import AddTestModal from '../shared/AddTestModal';
import Pdf_Clinic_Patient_Info from './Pdf_Clinic_Patient_Info';
import TUG_Test_Modal from '../Test_Modals/TUG_Test_Modal'
import L_Test_Modal from '../Test_Modals/L_Test_Modal'
import { Link } from 'react-router';
var scrollIntoView = require('scroll-into-view');

/*The component that renders the outcome tests history
as well as the dropdown list to select a test.*/
class SessionPage_OutcomeTests extends React.Component {

    /*The array of tests that gets mapped to a dropdown list
    for the user to select from. testId is the the id of the
    test in firebase while modalToBeViewed is the test
    to be viewed in the PDF modal.*/
    state = {
        testsList: [
            'TUG TEST',
            'L TEST',
            'PEQ TEST',
        ],
        testId: '',
        selectedTest: '',
        successMessage: '',
        alert: null,
        modalToBeViewed: {}
    }

    /*Styles for the button to add an outcome test.*/
    style = {
        addButton: {
            marginTop: 15,
            marginLeft: 150
        }
    }

    /*This function sets the selectedTest state variable
    to that of the test selected from the testsList
    state array via the dropdown menu for tests.*/
    selectTest (selectedTest) {
      this.setState({
        selectedTest
      })

      if (selectedTest === "TUG TEST") {

        document.getElementById("addOutcomeTestButton").dataset.target = "#tugTestModal"

      } else if (selectedTest === "L TEST") {

        document.getElementById("addOutcomeTestButton").dataset.target = "#lTestModal"

      } else if (selectedTest === "PEQ TEST") {

        document.getElementById("addOutcomeTestButton").dataset.target = "#peqTestModal"

      }
    }

    /*This function executes once a test to be edited has
    been selected. the selectedTest variable gets set as well
    as the firebase id for the selected test and testId gets
    passed into the AddTestModal component which is used to load
    pre-existing tests so the proper values can be set in the test
    modal.*/
    editTest (test, selectedTest) {

      if (selectedTest === "TUG TEST") {

        document.getElementById("editTestButton").dataset.target = "#tugTestModal"

      } else if (selectedTest === "L TEST") {

        document.getElementById("editTestButton").dataset.target = "#lTestModal"

      } else if (selectedTest === "PEQ TEST") {

        document.getElementById("editTestButton").dataset.target = "#peqTestModal"

      }
        this.setState({
            testId: test,
            selectedTest
        });

    }

    /*React lifecycle method: componentDidMount

    This method is invoked after the component has mounted and rendered.
    The scrollIntoView npm dependency is used here to automatically scroll
    down to the outcome test panel when the component is rendered.*/
    componentDidMount() {

      scrollIntoView(document.getElementById("outcomeTestPanel"))

    }

    onDelete (test) {
      const getAlert = (test) => (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Delete"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={() => this.deleteTest(test)}
          onCancel={() => this.onCancelAlert()}
          >
          You will not be able to recover this test!
          </SweetAlert>
      );

      this.setState({
        alert: getAlert(test)
      });
    }
    /*This function is executed when the Finish Session button is clicked. At this point
    a SweetAlert alert is thrown to warn the user that upon finishing the session, the user
    will not be able to make changes to existing tests or add new tests. onConfirm, the completeForm
    function will be executed. onCancel, the onCancelAlert function will be executed.*/
    onFinish () {
      const getAlert = () => (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Finish Session"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={() => this.finishSession()}
          onCancel={() => this.onCancelAlert()}
          >
          Once this session is completed you will not be able to make changes to existing tests or add new tests.
          </SweetAlert>
      );
      /*The alert state variable gets set to the getAlert constant storing the SweetAlert.*/
      this.setState({
        alert: getAlert()
      });
    }

    /*When either the Preview Information or View Report buttons get clicked (these buttons interchange
    depending on whether or not the session is completed or not (Finish Session button has been clicked.))
    then the modalToBeViewed state variable is set to the selected test which is passed in as a parameter
    of the same variable name.*/
    viewPdfModal(modalToBeViewed) {
      this.setState({
        modalToBeViewed
      });
    }

    /*This function is executed once the onConfirm button of the SweetAlert of the onDelete function is clicked
    after the delete button for the particular test is clicked and the test to be deleted is passed in to the
    parameter. The test is deleted using a default firebase function and the alert state variable is set to null
    to get rid of the SweetAlert*/
    deleteTest (test) {
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref(`/sessions/${userId}/${this.props.patientInformation.sessionId}/tests/${test.category}/${test.id}`).remove();
       this.setState({
          alert: null
        });
    }

    /*This function is executed once the onCancel button of the SweetAlert of the onDelete or onFinish function
    is clicked after the delete button for the particular test or the Finish Session button is clicked and the
    alert state variable is set to null to get rid of the alert.*/
    onCancelAlert () {
      this.setState({
        alert: null
      })
    }
    /*This function will execute once the onConfirm button of the SweetAlert of the onFinish function is clicked.
    Using a default firebase function, the completed variable in each firebase session is set to true to indicate
    that the session is completed. The alert state variable is set to null to get rid of the SweetAlert and
    a success message is thrown to indicate to the user that the session has been completed.*/
    finishSession () {
      event.preventDefault();
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref(`/sessions/${userId}/${this.props.patientInformation.sessionId}`).update({
        completed: true
      }).then(() => {
        this.setState({
          alert: null,
          successMessage: 'This session has been marked as completed.'
        })
      });
    }

    /*Once the save button has been clicked for a test in the AddTestModal component, the test id in firebase (testId)
    and the selected test in the form of a string for the test name (selectedTest) are set from the parameters passed in
    for the specific test when the function is called. These state variables are then passed in as props to the AddTestModal
    component to set the values that were previously set by the user (this is discussing the case where the user clicks
    edit to edit a test so the test modal should 'remember' the values that were previously entered).*/
    rememberValues (testId, selectedTest) {
      this.setState({
        testId,
        selectedTest
      })
    }

    /*This function parses through the sessionData which contains all
    sessions for a clinician and parses just the test information into
    into the sessionsParsed array because the session includes patient
    information which is not necessary to display.*/
    parseSessionDataIntoTests (sessionData) {

      let sessionsParsed = [];
      Object.keys(sessionData).forEach((testCategory) => {
        Object.keys(sessionData[testCategory]).forEach((test) => {
          sessionsParsed.push(sessionData[testCategory][test]);
        });
      });
      return sessionsParsed;
    }


	render() {

        /*Using the parseSessionDataIntoTests function that returns
        an array of the sessions data correctly parsed into just the tests,
        this array gets stored into the allTests constant. The enableFinish
        constant stores the allTests constant and is used to disable the Finish
        Session button of there are no tests completed.*/
        const allTests = this.props.patientInformation.tests ? this.parseSessionDataIntoTests(this.props.patientInformation.tests) : null;
        const enableFinish = allTests;

		return (
            <div id="wrapper">
            {/*This is where the SweetAlert is thrown if the delete button
            for a test or the Finish Session has been clicked.*/}
            {this.state.alert}
				<div className="records">
        {/*This is where the Outcome Tests History is rendered.*/}
        {this.state.successMessage && <div className="alert alert-success">{this.state.successMessage}</div>}
                    <div className="panel panel-default list-group-panel" id = "outcomeTestPanel">
                        <div className="panel-body">
                            <ul className="list-group list-group-header">
                                <li className="list-group-item list-group-body">
                                    <div className="row">
                                      <div className="panel-heading">
                                        Outcome Tests History
                                      </div>
                                      {/*The completed variable of each session in firebase stored in the patientInformation prop
                                      is checked (indicates if the session is completed or not). If the completed variable is
                                      not set to true, then the buttons for adding an outcome test and finishing the session
                                      will be rendered. */}
                                        {this.props.patientInformation.completed !== true && <div className="col-xs-12 pull-left">
                                            <div className="input-group input-group-xs">
                                                <div className="input-group-btn">
                                                    {/*This is where the test gets selected*/}
                                                    <button type="button" className="btn btn-lg btn-default" data-toggle="dropdown">{this.state.selectedTest || 'Select an Outcome Test'}<span> </span><span className="caret"></span></button>
                                                    {/*This is where the dropdown list of tests is rendered and gets
                                                      generated based on the testsList state array. When selected the selectTest
                                                      function is executed which will set the selectedTest variable which will
                                                      then be passed into the AddTestModal component as props to set the test modal fields of input.*/}
                                                    <ul className="dropdown-menu btn-lg" role="menu">
                                                        {this.state.testsList.map((testCategory, i) => <li key={i}><a onClick={this.selectTest.bind(this, testCategory)}> {testCategory} </a></li>)}
                                                    </ul>
                                                    {/*This is where the corresponding test modal is rendered once the Add Outcome Test button is clicked.
                                                      When selected the editTest function is executed which will set the testId and selectedTest variables
                                                      which will then be passed into the AddTestModal component as props to set the test modal fields of input.

                                                      By rendering the AddTestModal component in the render function of this component,
                                                      it is possible to target divs in this component using the data-target attribute.
                                                      Therefore, as shown in the button below, the data-target attribute is set to
                                                      the id of the div that renders the test modal in the AddTestModal component.
                                                      Therefore, once the Add Outcome Test button is clicked, (which enables once a
                                                      test has been selected) the appropriate test modal will be selected.
                                                      */}
                                                    <button disabled={!this.state.selectedTest}
                                                      onClick={this.editTest.bind(this, '', this.state.selectedTest)}
                                                      data-toggle="modal"
                                                      id="addOutcomeTestButton"
                                                      data-target=""
                                                      className="btn btn-lg btn-default"
                                                      type="button"
                                                    >
                                                      <span className="glyphicon glyphicon-plus">
                                                      </span> Add Outcome Test
                                                    </button>
                                                </div>

                                                {/*The finish button completes the session not allowing any tests to be added or changed
                                                  and is only enabled when at least one test has been successfully saved.*/}
                                                {this.props.patientInformation.completed !== true && <div className="col-xs-5 pull-right">
                                                <Link disabled = {!enableFinish} className="finish-button col-xl-12 btn btn-lg icon-btn btn-success" onClick={this.onFinish.bind(this)}>
                                                    Finish Session
                                                </Link></div>
                                                }
                                            </div>

                                        </div>}

                                    </div>
                                </li>
                            </ul>
                            {/*If there any tests successfully saved, this is where they will be displayed by first
                              checking if any tests exist in the allTests constant.*/}
                            {allTests && allTests.length > 0 ? <table id="mytable" className="table testTable table-bordred table-striped col-xs-11">
                              {/*The table header*/}
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Title</th>
                                  <th></th>
                                  <th>Category</th>
                                  <th>Created</th>
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                </tr>
                              </thead>
                              {/*By using the map function on the allTests constant, each test stored in the allTests
                                constant gets listed with the formatting shown below.*/}
                              <tbody>
                              {allTests && allTests.map((test, i) => <tr className = "striped" key={i}>
                                <td><span className="yellow glyphicon glyphicon-list-alt" aria-hidden="true" /></td>
                                <td>{test['title']}</td>
                                <td></td>
                                <td>{test['category']}</td>
                                <td>{moment(test['date'], "MMMM Do YYYY, h:mm:ss a").fromNow()}</td>

                                {/*This is where buttons are rendered depending on if the completed variable
                                  is true or not. In the case of the completed variable being true, the only
                                  button that renders will be the button to preview the report.*/}

                                {/*If the test at i in the allTests constant is not completed, (the completed variable
                                is currently set to false) then the edit, delete, and Preview Report buttons are
                                rendered.

                                If the session is not completed then each test can be edited.*/}
                                {this.props.patientInformation.completed !== true &&
                                <td>
                                  <p>
                                    <button
                                    onClick={this.editTest.bind(this, test['id'], test['category'])}
                                    data-toggle="modal"
                                    data-target=""
                                    id = "editTestButton"
                                    className="btn icon-btn btn-info">
                                    <span className="glyphicon glyphicon-pencil">
                                    </span>  Edit</button>
                                  </p>
                                </td>}

                                {/*If the session is not completed then each test can be deleted.*/}
                                {this.props.patientInformation.completed !== true &&
                                <td>
                                  <p>
                                    <button
                                      onClick={this.onDelete.bind(this, test)}
                                      className="btn icon-btn btn-danger">
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Delete
                                    </button>
                                  </p>
                                </td>}
                                {/*This is the button for previewing a report (meaning that the test
                                can still be edited as the session is still not complete) or for
                                viewing a report (meaning that the tests can no longer be edited and the
                                session is completed).*/}
                                {test['completed'] || this.props.patientInformation.completed === false ?
                                <td>
                                  <p>
                                    <button
                                      onClick={this.viewPdfModal.bind(this, test)}
                                      className="btn btn-default"
                                      data-toggle="modal"
                                      data-target="#pdfModal"
                                      id = "reportButton"
                                      >
                                      <span
                                      className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-success">
                                      </span>  Preview Report
                                    </button>
                                  </p>
                                </td> :
                                <td>
                                  <p>
                                    <button
                                      onClick={this.viewPdfModal.bind(this, test)}
                                      className="btn btn-default"
                                      data-toggle="modal"
                                      data-target="#pdfModal"
                                      id = "reportButton"
                                      >
                                      <span
                                      className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-success">
                                      </span>  View Report
                                    </button>
                                  </p>
                                </td>}

                              </tr>)}
                              {/*If the allTests constant contains no data then no tests
                                are displayed.*/}
                              </tbody>
                              </table> : <div className="well">
                                <h3>No outcome tests have been performed.</h3>
                              </div>}
                        </div>
                    </div>
                    <span>
                      Note: If patient information is not visible,
                      please reload the page. If patient information is
                      still not visible, then there is no data for this
                      patient stored locally on this machine.
                    </span>
                </div>
                {/*This is where both modal types are called so props can
                  be passed in. AddTestModal is the test modal for each test.
                  Pdf_Clinic_Patient_Info is the modal which reports the interpretation
                  of results for each test.*/}

                  <Pdf_Clinic_Patient_Info
                   settings={this.props.settings}
                   test={this.state.modalToBeViewed}
                   patientInformation={this.props.patientInformation}
                  />
                  <TUG_Test_Modal
                    selectedTest = {this.state.selectedTest}
                    sessionId={this.props.patientInformation.sessionId}
                    rememberValues={this.rememberValues.bind(this)}
                    tests={this.props.patientInformation.tests}
                    testId={this.state.testId}
                  />
                  <L_Test_Modal
                    selectedTest = {this.state.selectedTest}
                    sessionId={this.props.patientInformation.sessionId}
                    rememberValues={this.rememberValues.bind(this)}
                    tests={this.props.patientInformation.tests}
                    testId={this.state.testId}
                  />
              </div>
		)
	}
}

export default SessionPage_OutcomeTests;
