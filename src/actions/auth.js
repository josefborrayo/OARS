/*Actions for the auth reducers*/

/*In react-redux, reducers produce the state of the application
	while actions like the ones defined below are how the reducers know when
	to produce the next state. Redux actions are javascript objects
	and each action is associated with a type and the state that needs
	to be updated. The type property is a string that the reducers use
	to determine how to calculate the next state and the corresponding
	state is changed. Action types are declared as constants below.*/
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_NEXT = 'SET_NEXT';
export const RESET_NEXT = 'RESET_NEXT';
export const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE';

/*These are the actions assocaited with authorization. The corresponding
	reducers are found in the in the reducers/auth.js file. Each action is
	wrapped within a function. These functions are called action creators.*/

/*This is the action for logging in and updates the state of the user.*/
export function login(user) {
	return {
		type: LOGIN,
		user
	}
}
/*This is the action for getting a users settings and updates the state of the settings
	for the user.*/
export function fetchUserProfile(profile) {
	return {
		type: FETCH_USER_PROFILE,
		profile
	}
}
/*This is the action for logging out and simply logs the user out so there is no state that
	needs to be updated.*/
export function logout() {
	return {
		type: LOGOUT
	}
}

/*In redux, next sends the current action into the next middleware function in the chain. A
	middleware function is essentially a function that returns a function. The next function passes
	an action through this middleware. The purpose of the middleware is to avoid modifying the global
	state using methods such as setState directly in the reducer. Therefore, a middleware function
	is called when action is dispatched to manage functions that modify global state (which would
	violate good redux practices) before reaching the reducer.*/
export function setNext(next) {
	return {
		type: SET_NEXT,
		next
	}
}

/*This is the action for resetting the next function.*/
export function resetNext() {
	return {
		type: RESET_NEXT
	}
}
