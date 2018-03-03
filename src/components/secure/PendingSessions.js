import React from 'react';
import firebase from 'firebase'
import { connect } from 'react-redux';
import { Link } from 'react-router';
import SweetAlert from 'react-bootstrap-sweetalert';

/*This is the component for viewing the pending sessions.*/

class PendingSessions extends React.Component {

  /*The state variables for this component. The main state variable is the sessions
    array which stores all pending sessions in the array.*/
  state = {
    sessions: [],
    isFound: 'loading',
    alert: null
  }

  /*React lifecycle method: componentWillMount

  This method is invoked before the component mounts. Therefore it is called
  before render().*/
  componentWillMount() {
    /*This method checks before rendering the component if there are any
    pending sessions and if so uses the keys in firebase (the 16 character token associated
    with each session) and stores each session in the allSessions array.*/
    if (this.props.sessions) {
      let allSessions = [];
      Object.keys(this.props.sessions).forEach((identifier) => {
        allSessions.push(this.props.sessions[identifier])
      })
      /*Since there are sessions in the allSessions array, this array gets stored
      in the state array sessions. Also, the isFound state variable is set to yes
      so the page is no longer loading and sessions will be displayed.
      Otherwise, isFound is set to no and no sessions will be displayed.*/
      if (allSessions.length > 0) {
        this.setState({
          isFound: 'yes',
          sessions: allSessions
        })
      } else {
        this.setState({
          isFound: 'no',
          sessions: allSessions
        })
      }
    }
  }

  /*React lifecycle method: componentWillReceiveProps

  This method is invoked before a mounted component receives new props. This method is necessary
  for updating the state in reponse to prop changes which happens if a session is pending
  or deleted so the list of pending sessions can be updated. This method follows the same procedure
  as the componentWillMount method for this component.*/
  componentWillReceiveProps(nextProps) {

    if (nextProps.sessions) {
        let allSessions = [];
        Object.keys(nextProps.sessions).forEach((identifier) => {
          allSessions.push(nextProps.sessions[identifier])
        })
        if (allSessions.length > 0) {
          this.setState({
            isFound: 'yes',
            sessions: allSessions
          })
        } else {
          this.setState({
            isFound: 'no',
            sessions: allSessions
          })
        }
    }
  }

  /*This method throws an alert once the user has clicked the delete button.
  By using the SweetAlert dependency, the alert will be set to null if the
  cancel button is clicked or the deleteSession function will be executed
  if delete is selected.*/
  onDelete (session, pendingSession) {
    const getAlert = (session) => (
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Are you sure?"
        onConfirm={() => this.deleteSession(session, pendingSession)}
        onCancel={() => this.onCancelDelete()}
        >
        You will not be able to recover this report.
        </SweetAlert>
    );

    /*Setting the alert state variable to the getAlert constant defined
    in this function.*/
    this.setState({
      alert: getAlert(session)
    });
  }

  /*This function deletes the session from firebase once the delete button has been selected
  in the SweetAlert from the onDelete function.*/
  deleteSession (session, pendingSession) {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref(`/sessions/${userId}/${session.identifier}`).remove();
     this.setState({
        alert: null
      });

      if (pendingSession.length === 1) {
        /*This snippet of code is utilized various times and serves the purpose
        of reloading the page once to set the state variables properly to prevent
        this page from showing a loading symbol even though there are no more no
        tests to display.*/

      }

  }

  /*This function executes when the cancel button is selected from the SweetAlert in
  the onDelete function and sets the alert to null so it no longer shows.*/
  onCancelDelete () {
    this.setState({
      alert: null
    })
  }

  /*This function returns a cookie and accepts a cookie name as a parameter.*/
  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }

  /*This function returns the name of the patient from a cookie for a particular
  session and displays along with the patient ID and other information.*/
  getName(id) {

    const {
      sessions
    } = this.state;

    var cookie = this.getCookie(id.toString());
    if (cookie) {

      var cookieParse = JSON.parse(cookie);

      return cookieParse.field2;

    }
  }

	render() {
    const {
      sessions,
      isFound
    } = this.state;

    /*This constant returns a sum. The total number of tests that were completed for any given
    completed sessions are calculated by counting the number of tests in firebase.*/
    const noofTests = (tests) => {
      let sum = 0;
      if(tests && Object.keys(tests).length > 0) {
        Object.keys(tests).forEach((category) => {
          sum += Object.keys(tests[category]).length;
        })
      }
      return sum;
    }
    /*This constant stores all of the sessions with the completed variable
    set to 0 (meaning the sessions is pending) using the filter function to
    filter the sessions array.*/
    const pendingSession = sessions.filter((session) => session.completed === 0);
		return (
			<div id="wrapper">
        {this.state.alert}
        {isFound === 'loading' && <div id="loader"></div>}
			    <div className="records col-xs-9">
            <div className="panel panel-default list-group-panel">
                <div className="panel-body">
                    <ul className="list-group list-group-header">
                        <li className="list-group-item list-group-body">
                            <div className="row">
                                <div className="col-xs-6 text-left"><h3>Pending Sessions</h3></div>
                            </div>
                        </li>
                    </ul>
                    {/*This is where the pending sessions get listed or not listed
                       by checking the isFound state variable.*/}
                    {isFound === 'no' && <div className="well"><h3> No pending sessions.</h3></div>}

                    {/*Pending sessions exist.*/}
                    {sessions && pendingSession.length > 0 && <ul className="list-group list-group-body">
                      <div className="row">
                        <div className="col-xs-3 text-left" id="marginTop">
                            Patient
                        </div>
                        <div className="col-xs-3" id="marginTop">
                          Date Created
                        </div>
                        <div className="col-xs-3" id="marginTop">
                          No. of tests in progress
                        </div>
                      </div>
                      {/*By using the map method and the pendingSession constant defined at the beginning of the
                        render(), a new array is created and each element of the array is listed which in this case is
                        each pending session.*/}
                        {pendingSession.map((session, i) => (
                          <li className="list-group-item" key={i}>
                            {/*The details of each session are rendered here.*/}
                            <div className="row" id="row">
                                <div className="col-xs-3 text-left" id="marginTop">
                                  <strong id = "pendingName">
                                    <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
                                    {this.getName(session.id)}
                                  </strong>
                                  <p id="form_id" >ID: {session.id}</p>
                                </div>
                                <div className="col-xs-3" id="marginTop">
                                  {session.date}
                                </div>
                                <div className="col-xs-3" id="marginTop">
                                  <span id="test-no">{noofTests(session.tests)}</span>
                                </div>
                                {/*Buttons that allow for completed sessions to be viewed or deleted by the user.*/}
                                <div className="col-xs-3">
                                  <Link className="btn icon-btn btn-success video" to={`/test/${session.identifier}`}>

                                      <span className="glyphicon btn-glyphicon glyphicon-pencil img-circle text-success"></span>
                                      Edit Profile
                                      </Link>
                                  <a className="btn icon-btn btn-danger" onClick={this.onDelete.bind(this, session, pendingSession)}>
                                      <span className="glyphicon btn-glyphicon glyphicon-trash img-circle text-danger"></span>
                                      Delete
                                  </a>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>}
                </div>
            </div>
        </div>
    </div>
		)
	}
}

export default connect(state  => ({
    sessions: state.session.sessions
}))(PendingSessions);
