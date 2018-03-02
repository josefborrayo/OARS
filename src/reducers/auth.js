/*Reducer for auth actions.*/
import * as AuthActions from '../actions/auth';
import { GET_USER_SETTINGS } from '../actions/auth';

/*In react redux, a reducer is a function that takes two parameters. The current
state and an action. Reducers are responsible for producing the state of the
application. In redux, the state is immutable and does not change in place as
is normally done using the setState function in React. Therefore, a reducer returns
the same output for the given input. Actions are responsible for updating the state.*/

/*These constants below are the states of the application.*/
const initialState = {
	user: null,
	settings: null,
	next: null
};

/*A reducer function utilizes a switch statement and determines the next
state depending on the action type (the second parameter) and if there is
no matching action type when the function is called, then by default the
initial state is returned. By using Object.assign, mutations to the state
are avoided and a new object is returned with the properties of the previous
state as it copies values from a source object to a target object.*/

/*This function handles getting user settings, login/logout, and setting/resetting
the redux function used to push actions through middleware functions to avoid
mutating state in the reducer.*/
export function auth(state = initialState, action) {
	switch (action.type) {
		case AuthActions.LOGIN:
			return Object.assign({}, state, {
				user: action.user
			});
		case AuthActions.GET_USER_SETTINGS:
			return Object.assign({}, state, {
				settings: action.settings
			});
		case AuthActions.LOGOUT:
			return Object.assign({}, state, {
				user: null
			});

		case AuthActions.SET_NEXT:
			return Object.assign({}, state, {
				next: action.next
			});

		case AuthActions.RESET_NEXT:
			return Object.assign({}, state, {
				next: null
			});

		default:
			return state
	}
}
