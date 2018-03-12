{/*

This is the login component for the application.

*/}

import React from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { Link } from 'react-router';


class Login extends React.Component {

	/*Constructor to bind methods*/

	constructor(props) {

		super(props)

		this.handleSwitchToRegister = this.handleSwitchToRegister.bind(this)
		this.handleSwitchToLogin = this.handleSwitchToLogin.bind(this)
		this.clearErrorsAndFields = this.clearErrorsAndFields.bind(this)


	}

	/*State variables. In the case of the login component its simply the email and password*/

	state = {
		email: '',
		password: '',
		measurementUnit: '',
		error: null,
		isLoading: false
	};

	/*
		This method handles the login form submission by using a default firebase method
		which excepts the user input email and password as parameters.
	*/
	handleLogin(event) {
		event.preventDefault();
		this.setState({
			isLoading: true,
			error: ''
		})
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
			.then(() => {
				this.setState({
					isLoading: false,
					error: ''
				})
			})
			.catch((error) => {
				this.setState({ error: error.message, isLoading: false });
			});
	}

	/*
		This method handles the register form submission by using a default firebase method
		which excepts the user input email and password as parameters and creates a user in the firebase
		database. In addition, at the time of register, the user is also required to enter a Clinician
		ID, and a first and last name and these values are entered into the firebase database specific to
		this user. These can be changed depending on whatever information pertains to a clinician of a
		clinic or hospital.
	*/
	handleRegister(event) {
		event.preventDefault();
		this.setState({
			isLoading: true,
			error: ''
    })
    const {
      email,
      fullname,
      clinicId,
      password,
			measurementUnit
    } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userId = user.uid;
        const usersRef =  firebase.database().ref().child(`users/${userId}`);
        if (userId) {
          user.updateProfile({
            displayName: fullname
          }).then(() => {
            usersRef.set({
              email,
              fullname,
              clinicId,
							measurementUnit: "Imperial",
              password,
            }, (error) => {
              if (error) {
                this.setState({
                  isLoading: false,
                  error: error.message
                })
              }
            });
          }, (error) => {
            if (error) {
              this.setState({
                isLoading: false,
                error: error.message
              })
            }
          });
        }
        this.setState({
          isLoading: false,
          error: ''
        })
      })
			.catch((error) => {
				this.setState({ error: error.message, isLoading: false });
			});
	}

	/*This method handles any input change to a text
		field and updates the appropriate state variables.*/
	onInputChange(name, event) {
		var change = {};
		change[name] = event.target.value;
		this.setState(change);
	}

	/*These two methods below simply change the CSS of the login form
		and the register form to display one or the other when a link has been clicked*/

	handleSwitchToRegister() {

		this.clearErrorsAndFields();
		document.getElementById("login-form").style.display = 'none'
		document.getElementById("register-form").style.display = 'block'

	}

	handleSwitchToLogin() {

		this.clearErrorsAndFields();
		document.getElementById("login-form").style.display = 'block'
		document.getElementById("register-form").style.display = 'none'

	}

	clearErrorsAndFields() {

		this.setState({error: null})
		this.setState({email: '', password: ''})

	}


	/*This is where the component is rendered*/
	render() {
		var errors = this.state.error ? <p> {this.state.error} </p> : '';
		const isRegisterEnabled = this.state.email.length > 0 &&
		this.state.password.length > 0 && (this.state.fullname && this.state.fullname.length > 0)
		&& (this.state.clinicId && this.state.clinicId.length > 0);

		return (
			<div>
			{/*This is the login form. When the sign in button is clicked this form's submission
			is handled using the handleLogin method above.*/}
			<form onSubmit={this.handleLogin.bind(this)} id="login-form" action="#" method="post" role="form">
				<div className = "panel-heading text-center">
					<h4 id = "heading-value">Login</h4>
				</div>
				{/*Clinician's email*/}
				<div className="form-group">
					<label htmlFor="email">Email Address</label>
					<input
						type="text"
						name="login_email"
						id="login_email"
						tabIndex="1"
						className="form-control"
						placeholder="Email Address"
						value={this.state.email}
						onChange={this.onInputChange.bind(this, 'email')}
					/>
				</div>

				{/*Clinician's password*/}
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="login_password"
						id="login_password"
						tabIndex="2"
						className="form-control"
						placeholder="Password"
						value={this.state.password}
						onChange={this.onInputChange.bind(this, 'password')}
					/>
				</div>
				<br/>
				{errors && <div className="alert alert-danger">{errors}</div>}
				<div className="form-group">
				{/*This is for the loading circle which persists until a redirect occurs,*/}
				{this.state.isLoading && <div style={{ 'left': '60%', 'width': '45px', 'height': '45px', 'top': '85%' }} id="loader"></div>}
					<div className="row">
					{/*When this link is clicked, the CSS of the login form gets set so that it is hidden while the register form is displayed.*/}
					<div className="col-sm-6 col-sm-offset-3">
						<input disabled={this.state.isLoading} type="submit" name="login-submit" id="login-submit" tabIndex="4" className="form-control btn btn-login" value="Sign In" />
					</div>
					</div>
					<a onClick = {this.handleSwitchToRegister.bind(this)}><h4 className = "text-center">New user? Sign up here.</h4></a>
				</div>
				</form>
				{/*This is the register form*/}
				<form onSubmit={this.handleRegister.bind(this)} id="register-form" action="#" method="post" role="form">
									<div className = "panel-heading text-center">
										<h3 id = "heading-value">Register</h3>
									</div>
									{/*Clinician's full name*/}
	                <div className="form-group">
	                <label htmlFor="fullname">Full Name</label>
	                <input
	                  type="text"
	                  name="fullname"
	                  id="fullname"
	                  tabIndex="1"
	                  className="form-control"
	                  placeholder="Full Name"
	                  value={this.state.fullname}
	                  onChange={this.onInputChange.bind(this, 'fullname')}
	                />
	              </div>

								{/*Clinician's desired email*/}
	              <div className="form-group">
	                <label htmlFor="email">Email Address</label>
	                <input
	                  type="text"
	                  name="email"
	                  id="email"
	                  tabIndex="1"
	                  className="form-control"
	                  placeholder="Email Address"
	                  value={this.state.email}
	                  onChange={this.onInputChange.bind(this, 'email')}
	                />
	              </div>

								{/*Clinician's desired password*/}
	              <div className="form-group">
	                <label htmlFor="password">Password</label>
	                <input
	                  type="password"
	                  name="password"
	                  id="password"
	                  tabIndex="2"
	                  className="form-control"
	                  placeholder="Password"
	                  value={this.state.password}
	                  onChange={this.onInputChange.bind(this, 'password')}
	                />
	              </div>

								{/*Clinician's ID*/}
	              <div className="form-group">
	                <label htmlFor="hospital-id">Clinician ID</label>
	                <input
	                  type="password"
	                  name="hospital-id"
	                  id="hospital-id"
	                  tabIndex="2"
	                  className="form-control"
	                  placeholder="Clinician ID"
	                  value={this.state.clinicId}
	                  onChange={this.onInputChange.bind(this, 'clinicId')}
	                />
	              </div>
								{!isRegisterEnabled && <div className="alert alert-danger">All fields are required</div>}
								{errors && <div className="alert alert-danger">{errors}</div>}
				  			<br/>
								{/*Submit button for the form*/}
	              <div className="form-group">
	                <div className="row">
	                <div className="col-sm-6 col-sm-offset-3">
	                  <input
	                    type="submit"
	                    name="register-submit"
	                    id="register-submit"
	                    tabIndex="4"
	                    className="form-control btn btn-success btn-register"
	                    value="Register Now"
											disabled={!isRegisterEnabled}
	                  />
										{/*When this link is clicked, the CSS of the register form gets set so that it is hidden while the login form is displayed.*/}
	                </div>
	                </div>
									<a onClick = {this.handleSwitchToLogin.bind(this)}><h4 className = "text-center">Already have an account? Log in here.</h4></a>
	              </div>
				</form>
				</div>
		);
	}
}

export default Login;
