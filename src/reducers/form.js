/*Reducer for form actions*/

import {
    FETCH_FORM,
    SAVE_QUESTIONS
} from '../actions/form.js';

/*In react redux, a reducer is a function that takes two parameters. The current
state and an action. Reducers are responsible for producing the state of the
application. In redux, the state is immutable and does not change in place as
is normally done using the setState function in React. Therefore, a reducer returns
the same output for the given input. Actions are responsible for updating the state.*/

/*These constants below are the states of the application.*/
const initialState = {
	forms: null,
	questions: null
};

/*A reducer function utilizes a switch statement and determines the next
state depending on the action type (the second parameter) and if there is
no matching action type when the function is called, then by default the
initial state is returned. By using Object.assign, mutations to the state
are avoided and a new object is returned with the properties of the previous
state as it copies values from a source object to a target object.*/

/*This function handles getting the sessions and questions for the PEQ.*/
export function form (state = initialState, action) {
    switch(action.type) {
        case FETCH_FORM:
          return Object.assign({}, state, {
            forms: {...action.forms}
          });
        case SAVE_QUESTIONS:
          return Object.assign({}, state, {
            questions: {...action.questions}
          });
        default:
          return state
    }
}
