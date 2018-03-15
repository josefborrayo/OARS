import React from 'react'
import * as firebase from 'firebase';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { push } from 'react-router-redux';

import '../assets/css/home.css';

//This is login/register page component.
import Login from './auth/Login';

class Home extends React.Component {

	state={
		email: '',
		password: '',
		error: null
	};

	componentDidMount() {
		/*If there is successful login, redirect to the next page
		or reload the login page using the default redux next
		and redirect functions.*/
		if (firebase.auth().currentUser) {
			this.props.onRedirect(this.props.next || '/dashboard');
		}
	}

	//The Login component is rendered here which
	//handles both logging in and registering a user.
	render() {
		return (
			<div>

			<div className="loginPageBackground" />
			<img
			id = "loginLogo"
			src="/images/aopaLOGO.png"
			alt="AOPA"
			/>
			<div id="regContainer" className="container">
			<div className="row">
			<div className="col-md-6 col-md-offset-3">
			  <div className="panel panel-login loginPanel">
					<div className="panel-body">
					  <div className="row">
							<div className="col-lg-12">
							  <Login />
							</div>
					  </div>
					</div>
			  </div>
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
component will have access to the updated state. The dispatch function
is used to dispatch a redux action (function - action creator) which gets
sent to a redux reducer to update the store. In this case, onRedirect is
an included function so there is no action or reducer defined for this
function.*/
export default connect(null, dispatch=> ({
	onRedirect: (path)=> {
		dispatch(push(path));
	}
}))(Home);
