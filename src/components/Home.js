import React from 'react'
import * as firebase from 'firebase';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { push } from 'react-router-redux';

import '../assets/css/home.css';

//components
import Login from './auth/Login';

class Home extends React.Component {

	state={
		email: '',
		password: '',
		error: null
	};

	componentDidMount() {
		if (firebase.auth().currentUser) {
			this.props.onRedirect(this.props.next || '/dashboard');
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
			.catch((error)=> {
				this.setState({ error: error });
			});
	}

	onInputChange(name, event) {
		var change= {};
		change[name]= event.target.value;
		this.setState(change);
	}

	render() {
		return (
			<div>

			<div id="fullscreen_bg" className="fullscreen_bg" />
			<img
			id = "smallLogo"
			src="/images/aopaLOGO.png"
			alt="AOPA"
			/>
			<div id="regContainer" className="container">
			<div className="row">
			<div className="col-md-6 col-md-offset-3">
			  <div className="panel panel-login loginPanel">
				{/*
				<div className="panel-heading">
				  <div className="row">
					<div className="col-xs-6">
					  <Link href="#" classname = "active" id="login-form-link">Login</Link>
					</div>
					<div className="col-xs-6">
					  <Link href="#" id="register-form-link">Register</Link>
					</div>
				  </div>
				  <hr />
				</div>
				*/}

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

export default connect(null, dispatch=> ({
	onRedirect: (path)=> {
		dispatch(push(path));
	}
}))(Home);
