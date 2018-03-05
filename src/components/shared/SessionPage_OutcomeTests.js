import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import SweetAlert from 'react-bootstrap-sweetalert';
import AddTestModal from '../shared/AddTestModal';
import PdfReportModal from './PdfReportModal';
import { Link } from 'react-router';
var scrollIntoView = require('scroll-into-view');

class SessionPage_OutcomeTests extends React.Component {

    state = {
        allTestCategory: [
            'TUG TEST',
            'L TEST',
            'PEQ TEST',
        ],
        testId: '',
        selectedTest: '',
        successMessage: '',
        alert: null,
        downloadTest: {}
    }
    style = {
        addButton: {
            marginTop: 15,
            marginLeft: 150
        }
    }

    selectTest (selectedTest) {
      this.setState({
        selectedTest
      })
    }

    editTest (test, selectedTest) {
        this.setState({
            testId: test,
            selectedTest
        });
    }

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
          onCancel={() => this.onCancelDelete()}
          >
          You will not be able to recover this test!
          </SweetAlert>
      );

      this.setState({
        alert: getAlert(test)
      });
    }

    onFinish () {
      const getAlert = () => (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Finish Session"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title="Are you sure?"
          onConfirm={() => this.completeForm()}
          onCancel={() => this.onCancelDelete()}
          >
          Once this session is completed you will not be able to make changes to existing tests or add new tests.
          </SweetAlert>
      );

      this.setState({
        alert: getAlert()
      });
    }


    downloadPdf(downloadTest) {
      this.setState({
        downloadTest
      });
    }

    deleteTest (test) {
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref(`/sessions/${userId}/${this.props.patientInformation.sessionId}/tests/${test.category}/${test.id}`).remove();
       this.setState({
          alert: null
        });
    }

    onCancelDelete () {
      this.setState({
        alert: null
      })
    }

    finishTest (test, event) {
      event.preventDefault();
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref(`/sessions/${userId}/${this.props.patientInformation.sessionId}/tests/${test.category}/${test.sessionId}`).update({
        completed: 1
      }).then(() => {
        this.setState({
          successMessage: 'This test has been marked as completed.'
        })
      });
    }

    resetValue (selectedTest, selectedCategory) {
      this.setState({
        selectedTest,
        selectedCategory
      })
    }

    completeForm () {
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref(`/sessions/${userId}/${this.props.patientInformation.sessionId}`).update({
        completed: 1
      }).then(() => {
        this.setState({
          alert: null,
          successMessage: `This settings has been marked as completed`
        })
      });
    }

    resetValue (testId, selectedTest) {
      this.setState({
        testId,
        selectedTest
      })
    }

    flattenData (data) {
      let result = [];
      Object.keys(data).forEach((category) => {
        Object.keys(data[category]).forEach((test) => {
          result.push(data[category][test]);
        });
      });
      return result;
    }

	render() {
        const allTests = this.props.patientInformation.tests ? this.flattenData(this.props.patientInformation.tests) : null;
        const enableFinish = allTests;

		return (
            <div id="wrapper">
            {this.state.alert}
				<div className="records">
        {this.state.successMessage && <div className="alert alert-success">{this.state.successMessage}</div>}
                    <div className="panel panel-default list-group-panel" id = "outcomeTestPanel">
                        <div className="panel-body">
                            <ul className="list-group list-group-header">
                                <li className="list-group-item list-group-body">
                                    <div className="row">
                                      <div className="panel-heading">
                                        Outcome Tests History
                                      </div>

                                        {this.props.patientInformation.completed !== 1 && <div className="col-xs-12 pull-left">
                                            <div className="input-group input-group-xs">
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-lg btn-default" data-toggle="dropdown">{this.state.selectedTest || 'Select an Outcome Test'} <span className="caret"></span></button>
                                                    <ul className="dropdown-menu btn-lg" role="menu">
                                                        {this.state.allTestCategory.map((testCategory, i) => <li key={i}><a onClick={this.selectTest.bind(this, testCategory)}> {testCategory} </a></li>)}
                                                    </ul>
                                                    <button disabled={!this.state.selectedTest}
                                                      onClick={this.editTest.bind(this, '', this.state.selectedTest)}
                                                      data-toggle="modal"
                                                      data-target="#videoModal"
                                                      className="btn btn-lg btn-default"
                                                      type="button"
                                                    >
                                                      <span className="glyphicon glyphicon-plus">
                                                      </span>Add Outcome Test
                                                    </button>
                                                </div>


                                                {this.props.patientInformation.completed !== 1 && <div className="col-xs-5 pull-right">
                                                <Link  disabled = {!enableFinish} className="finish-button col-xl-12 btn btn-lg icon-btn btn-success" onClick={this.onFinish.bind(this)}>
                                                    Finish Session
                                                </Link></div>}
                                            </div>

                                        </div>}

                                    </div>
                                </li>
                            </ul>
                            {allTests && allTests.length > 0 ? <table id="mytable" className="table testTable table-bordred table-striped col-xs-11">
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
                              <tbody>
                              {allTests && allTests.map((test, i) => <tr className = "striped" key={i}>
                                <td><span className="yellow glyphicon glyphicon-list-alt" aria-hidden="true" /></td>
                                <td>{test['title']}</td>
                                <td></td>
                                <td>{test['category']}</td>
                                <td>{moment(test['date'], "MMMM Do YYYY, h:mm:ss a").fromNow()}</td>
                                {/* !test['completed'] &&  --- v*/}
                                {!test['completed'] && this.props.patientInformation.completed !== 1 && <td><p><button onClick={this.editTest.bind(this, test['id'], test['category'])} data-toggle="modal" data-target="#videoModal" className="btn icon-btn btn-info"><span className="glyphicon glyphicon-pencil"></span>  Edit</button></p></td>}
                                {this.props.patientInformation.completed !== 1 && <td><p><button onClick={this.onDelete.bind(this, test)} className="btn icon-btn btn-danger"><span className="glyphicon glyphicon-trash"></span>  Delete</button></p></td>}
                                {/*test['completed'] ||*/}{
                                test['completed'] || this.props.patientInformation.completed === 0 ?
                                <td>
                                  <p>
                                    <button onClick={this.downloadPdf.bind(this, test)}
                                        className="btn btn-default" data-toggle="modal" data-target="#pdfModal" >
                                      <span className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-success"></span>  Preview Report
                                    </button>
                                  </p>
                                </td> :

                                    <td><p><span>        </span><button onClick={this.downloadPdf.bind(this, test)}
                                        className="btn btn-default" data-toggle="modal" data-target="#pdfModal" >
                                      <span className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-success"></span>  View Report
                                    </button></p></td>}

                              </tr>)}
                              </tbody>
                              </table> : <div className="well">
                                <h3>No outcome tests have been performed.</h3>
                              </div>}
                        </div>
                    </div>
                    <span>Note: If patient information is not visible, please reload the page. If patient information is still not visible, then there is no data for this patient stored locally on this machine.</span>
                </div>
                <AddTestModal
                  tests={this.props.patientInformation.tests}
                  questions={this.props.questions}
                  testId={this.state.testId}
                  selectedTest={this.state.selectedTest}
                  sessionId={this.props.patientInformation.sessionId}
                  resetValue={this.resetValue.bind(this)}
                />
                <PdfReportModal settings={this.props.settings} test={this.state.downloadTest} patientInformation={this.props.patientInformation} />
            </div>
		)
	}
}

export default SessionPage_OutcomeTests;
