import * as firebase from 'firebase';
import * as config from '../../firebase.config.js';
import { setNext } from '../actions/auth';

firebase.initializeApp(config);
/*This function checks for user authentication on each page and will
return the user to the login page if the user is not signed in. The
redux dispatch function is used to change the pathname of the application.*/
export function requireAuth(store) {
	return function (nextState, replace) {
		if (firebase.auth().currentUser === null) {
			store.dispatch(setNext(nextState.location.pathname));
			replace({
				pathname: '/',
			})
		}
	}
}
