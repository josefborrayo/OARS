/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { login, logout, resetNext, fetchUserProfile } from '../actions/auth';

import {
    fetchForm,
		saveQuestions
} from '../actions/form';
import { push } from 'react-router-redux';

//component
import Sidebar from './shared/Sidebar';
import HeaderBar from './shared/HeaderBar';
import PeqQuestions from './shared/PeqQuestions';

class App extends React.Component {

  constructor(props) {

    super(props)


  }
	state = {
		loaded: false,
		authenticated: false
	};

	styles = {
		app: {
			fontFamily: [
				'HelveticaNeue-Light',
				'Helvetica Neue Light',
				'Helvetica Neue',
				'Helvetica',
				'Arial',
				'Lucida Grande',
				'sans-serif'
			],
			fontWeight: 300
		},
		row: {
			'padding': 20
		}
	};

	componentDidMount() {
		localStorage.setItem('questions', JSON.stringify(PeqQuestions))
		this.checkAuthentication();
	}

  checkAuthentication() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({
					authenticated: true
				})
				firebase.database().ref().child(`users/${user.uid}`)
					.on('value', (snapshot) => {
						this.props.fetchUserProfile(snapshot.val());
					})
				this.props.onLogin(user);
				this.props.onRedirect(this.props.next || '/dashboard');
				this.props.onResetNext();
				firebase.database().ref('/forms').on('value', (snapshot) => {
          const allForms = snapshot.val();
					this.props.fetchUserForm(allForms[user.uid]);
					this.props.saveQuestions(JSON.parse(localStorage.getItem('questions')));
				})
			} else {
				if (this.props.user) {
					this.props.onRedirect('/');
					this.props.onResetNext();
				} else {
					this.props.onLogout();
				}
				this.setState({
					authenticated: false
				});
			}
			if (!this.state.loaded) {
				this.setState({ loaded: true });
			}
		});
	}


	render() {

		const view1 = <div id="wrapper" style={ this.styles.app }>
			<HeaderBar />
			<div className="row1">
				<div className="col-md-2">
					<Sidebar user={this.props.user}/>

				</div>
				{ this.state.loaded ? this.props.children : <div id="loader"></div> }
			</div>
		</div>
		return (
			<div>
				{this.state.authenticated ? view1 :
				<div>
					{ this.state.loaded ? this.props.children : <div id="loader"></div> }
				</div>}
			</div>
		)
	}
}

export default connect(state => ({
  next: state.auth.next,
  user: state.auth.user}), dispatch => ({
	onLogin: user => {
		dispatch(login(user));
  },
  fetchUserProfile: user => {
		dispatch(fetchUserProfile(user));
	},
	onLogout: () => {
		dispatch(logout());
	},
	onRedirect: (path) => {
		dispatch(push(path));
	},
	onResetNext: () => {
		dispatch(resetNext());
	},
	fetchUserForm: forms => {
    dispatch(fetchForm(forms));
	},
	saveQuestions: questions => {
    dispatch(saveQuestions(questions));
  }
}))(App);
