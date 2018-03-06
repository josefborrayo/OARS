import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router';

/*This is the component for viewing the completed sessions.*/

class CompletedSessions extends React.Component {

  /*The state variables for this component. The main state variable is the sessions
    array which stores all completed sessions in the array.*/
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
    completed sessions and if so uses the keys in firebase (the 16 character token associated
    with each session) and stores each session in the allSessions array.*/
    if (this.props.sessions) {
      let allSessions = [];
      Object.keys(this.props.sessions).forEach((sessionId) => {
        allSessions.push(this.props.sessions[sessionId])
      })
      /*Since there are sessions in the allSessions array, this array gets stored
      in the state array, sessions. Also, the isFound state variable is set to yes
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
  for updating the state in reponse to prop changes which happens if a session is completed
  or deleted so the list of completed sessions can be updated. This method follows the same procedure
  as the componentWillMount method for this component.*/
  componentWillReceiveProps(nextProps) {

    if (nextProps.sessions) {
        let allSessions = [];
        Object.keys(nextProps.sessions).forEach((sessionId) => {
          allSessions.push(nextProps.sessions[sessionId])
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
  onDelete (session, completedSession) {

    /*Storing the alert in a binded constant*/
    const getAlert = (session) => (
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Are you sure?"
        onConfirm={() => this.deleteSession(session, completedSession)}
        onCancel={() => this.onCancelDelete()}
        >
        You will not be able to recover this report!
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
  deleteSession (session, completedSession) {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref(`/sessions/${userId}/${session.sessionId}`).remove();
     this.setState({
        alert: null
      });
      this.setState({isFound: 'no'})

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
    set to 1 using the filter function to filter the sessions array.*/
    const completedSession = sessions.filter((session) => session.completed === true);
		return (
			<div id="wrapper">
      {this.state.alert}
			    <div className="records col-md-9">
            <div className="panel panel-default list-group-panel">
                <div className="panel-body">
                    <ul className="list-group list-group-header">
                        <li className="list-group-item list-group-body">
                            <div className="row">
                                <div className="col-xs-6 text-left"><h3>Completed Profiles</h3></div>
                            </div>
                        </li>
                    </ul>
                    {/*This is where the completed sessions get listed or not listed
                      by checking the isFound state variable.*/}
                    {(completedSession.length === 0 || isFound === 'no') ? <div className="well"><h3> No pending sessions.</h3></div> :
                    <ul className="list-group list-group-body">
                    <div className="row">
                        <div className="col-xs-3 text-left" id="marginTop">
                            Patient
                        </div>
                        <div className="col-xs-3" id="marginTop">
                          Created date
                        </div>
                        <div className="col-xs-3" id="marginTop">
                          No. of tests
                        </div>
                      </div>
                      {/*By using the map method and the completedSession constant defined at the beginning of the
                        render(), a new array is created and each element of the array is listed which in this case is
                        each completed session.*/}
                        {completedSession.map((session, i) => (
                          <li className="list-group-item" key={i}>
                            {/*The details of each session are rendered here.*/}
                            <div className="row" id="row">
                                <div className="col-xs-3 text-left" id="marginTop">
                                  <strong>
                                    <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
                                    {this.getName(session.id)}
                                  </strong>
                                  <p id="form_id">ID: {session.id}</p>
                                </div>
                                <div className="col-xs-3" id="marginTop">
                                  {session.date}
                                </div>
                                <div className="col-xs-3" id="marginTop">
                                  <span id="test-no">{noofTests(session.tests)}</span>
                                </div>
                                {/*Buttons that allow for completed sessions to be viewed or deleted by the user.*/}
                                <div className="col-xs-3">
                                  <Link to={'/test/' + session.sessionId} className="btn icon-btn btn-primary video">
                                      <span className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-success"></span>
                                      View Profile
                                      </Link>
                                  <a onClick={this.onDelete.bind(this, session, completedSession)} className="btn icon-btn btn-danger">
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
/*The connect function connects the application to a redux store.
Redux store stores the state of the application. By passing in the
state parameter, this component subscribes to the redux store updates.
Therefore, whenever the store (state of the application) is updated, the
component will have access to the updated state. */
export default connect(state  => ({
    /*The sessions state variable which keeps track of sessions both
    pending and completed in firebase.*/
    sessions: state.session.sessions
}))(CompletedSessions);
