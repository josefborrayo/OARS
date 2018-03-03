/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { login, logout, resetNext, fetchUserSettings } from '../actions/auth';

import {
    fetchSessions,
		saveQuestions
} from '../actions/session';
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
						this.props.fetchUserSettings(snapshot.val());
					})
				this.props.onLogin(user);
				this.props.onRedirect(this.props.next || '/dashboard');
				this.props.onResetNext();
				firebase.database().ref('/sessions').on('value', (snapshot) => {
          const allSessions = snapshot.val();
					this.props.fetchUserSessions(allSessions[user.uid]);
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
/*The connect function connects the application to a redux store.
Redux store stores the state of the application. By passing in the
state parameter, this component subscribes to the redux store updates.
Therefore, whenever the store (state of the application) is updated, the
component will have access to the updated state. The dispatch function
is used to dispatch a redux action (function - action creator) which gets
sent to a redux reducer to update the store.*/
export default connect(state => ({
  next: state.auth.next,
  user: state.auth.user}), dispatch => ({
	onLogin: user => {
		dispatch(login(user));
  },
  fetchUserSettings: user => {
		dispatch(fetchUserSettings(user));
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
	fetchUserSessions: sessions => {
    dispatch(fetchSessions(sessions));
	},
	saveQuestions: questions => {
    dispatch(saveQuestions(questions));
  }
}))(App);
