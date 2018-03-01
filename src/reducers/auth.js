import * as AuthActions from '../actions/auth';
import { FETCH_USER_PROFILE } from '../actions/types';

const initialState = {
	user: null,
	profile: null,
	next: null
};

export function auth(state = initialState, action) {
	switch (action.type) {
		case AuthActions.LOGIN:
			return Object.assign({}, state, {
				user: action.user
			});
		case FETCH_USER_PROFILE:
			return Object.assign({}, state, {
				profile: action.profile
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